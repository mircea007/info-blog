#!/bin/python3
import re
import json
import os
import sys
import tempfile

def agree():
  x = input('Do you want to continue (y/n)')
  if x != 'y':
    sys.exit(0)

opt = sys.argv[1:]
assert len(opt) == 2

src = os.path.abspath(opt[0])
dest = os.path.abspath(opt[1])
repo_path = os.path.dirname(os.path.abspath(__file__))

os.chdir(repo_path)

print(f'all the .tex documents inside {src} will be compiled and archived inside {dest}')
agree()

filenames = list(filter(lambda x: x.endswith('.tex'), os.listdir(src)))
print('\n'.join(filenames))

docs = list()
for doc in filenames:
  src_path = os.path.join(src, doc)
  content = open(src_path, 'r').read()

  match = re.search(r'\\title\{([^}]*)\}', content)
  title = match.group(1) if match else None

  match = re.search(r'\\date\{([^}]*)\}', content)
  date = match.group(1) if match else None

  docs.append({
    'filename': doc,
    'code': doc.removesuffix('.tex'),
    'title': title,
    'date': date
  })

my_meta = dict()
for doc in docs:
  my_meta[doc['code']] = doc

print(f'meta is {json.dumps(my_meta, indent=2)}')

agree()

with tempfile.TemporaryDirectory() as tmpdir:
    print(f"Working in {tmpdir}")
    os.system(f"cp -r {repo_path}/. {tmpdir}")
    os.chdir(tmpdir)

    print(os.getcwd())

    os.system("rm -rf ./frontend/public")
    os.system("rm -rf ./frontend/out")
    os.system("rm -rf ./.git")

    #os.system('find .')
    #sys.exit(1)

    os.system("mkdir ./frontend/public/")
    open('./frontend/public/meta.json', 'w').write(json.dumps(my_meta))
    os.system("mkdir ./frontend/public/lectures/")
    for doc_meta in docs:
      os.system(f'./compiler/my_latex2html {os.path.join(src, doc_meta['filename'])} {os.path.join('./frontend/public/lectures/', doc_meta['code'] + '.html')}')

    os.chdir('./frontend')
    os.system('npm run build')
    os.chdir('./out')
    os.system(f'zip -r {dest} .')

    os.chdir(repo_path)

print('Done!')
