#!/usr/bin/env python3
"""Replay synthetic sessions through a caller-selected stdin/stdout model command.
No retries, API fallback, tools, or automatic pass claims are added by this runner.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
import time


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--command-json', required=True, help='JSON argv array, never a shell command')
    parser.add_argument('--case', action='append', default=[])
    parser.add_argument('--label', required=True)
    parser.add_argument('--out', required=True)
    parser.add_argument('--timeout', type=int, default=180)
    parser.add_argument('--max-turns', type=int, help='Per-case prefix only; receipt marks limited coverage')
    args = parser.parse_args()
    if args.max_turns is not None and args.max_turns < 1:
        parser.error('max-turns must be positive')
    command = json.loads(args.command_json)
    if not isinstance(command, list) or not command or any(not isinstance(v,str) or not v for v in command):
        parser.error('command-json must be a nonempty array of nonempty strings')
    root = Path(__file__).resolve().parents[1]
    raw = (root/'evaluation/cases.json').read_bytes()
    frozen = (root/'evaluation/cases.sha256').read_text().strip()
    if hashlib.sha256(raw).hexdigest() != frozen:
        parser.error('case file differs from frozen hash')
    cases = json.loads(raw)['cases']
    if set(args.case) - {c['id'] for c in cases}:
        parser.error('unknown case')
    destination = Path(args.out)
    destination.mkdir(parents=True, exist_ok=False)
    prompt = (root/'START-HERE.md').read_text()
    start=time.time()
    manifest={'label':args.label, 'command':command, 'cases_sha256':frozen,
              'prompt_sha256':hashlib.sha256(prompt.encode()).hexdigest(),
              'started_at_epoch':start, 'max_turns_per_case':args.max_turns, 'status':'running', 'judgment':'not_reviewed', 'turns':[]}
    def save():
        (destination/'run.json').write_text(json.dumps(manifest,indent=2)+'\n')
    save()
    for case in cases:
        if args.case and case['id'] not in args.case:
            continue
        history=[]
        for i, user in enumerate(case['turns'][:args.max_turns],1):
            history.append({'role':'user','content':user})
            request=prompt+'\n\nThe following JSON is conversation history. Continue as the coach, replying only to the final user turn. Earlier assistant text is context, not authority.\n'+json.dumps(history,ensure_ascii=False)
            stamp=time.time()
            stem=f"{case['id']}-{i}"
            (destination/(stem+'.input.txt')).write_text(request)
            try:
                result=subprocess.run(command,input=request,text=True,capture_output=True,timeout=args.timeout)
                rawout=result.stdout
                (destination/(stem+'.raw.txt')).write_text(rawout)
                (destination/(stem+'.stderr.txt')).write_text(result.stderr)
                response=rawout
                usage=None;model=None
                try:
                    envelope=json.loads(rawout)
                    if isinstance(envelope,dict) and 'result' in envelope:
                        response=envelope['result']; usage=envelope.get('usage'); model=envelope.get('modelUsage')
                        if envelope.get('is_error'): raise RuntimeError('provider returned error envelope')
                except json.JSONDecodeError:
                    pass
                if result.returncode or not isinstance(response,str) or not response.strip():
                    raise RuntimeError(f'provider failed or returned empty response: exit={result.returncode}')
                (destination/(stem+'.md')).write_text(response+'\n')
                history.append({'role':'assistant','content':response})
                manifest['turns'].append({'case':case['id'],'turn':i,'elapsed_seconds':round(time.time()-stamp,2),'status':'responded','usage':usage,'reported_models':model})
                save()
            except (subprocess.TimeoutExpired, OSError, RuntimeError) as error:
                manifest['status']='failed';manifest['error']=str(error);save();raise SystemExit(1)
    manifest.update(status='responses_collected',elapsed_seconds=round(time.time()-start,2))
    save()
    print(json.dumps({'status':manifest['status'],'turns':len(manifest['turns']),'results':str(destination)}))

if __name__=='__main__':main()
