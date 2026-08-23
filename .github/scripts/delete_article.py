#!/usr/bin/env python3
import os
import json
import sys

ARTICLES_DIR = 'articles'
OUTPUT = 'manifest.json'

name = os.environ.get('ARTICLE_NAME', '').strip()
if not name:
    print('ERROR: article_name is empty.')
    sys.exit(1)

with open(OUTPUT, 'r', encoding='utf-8') as f:
    data = json.load(f)

articles = data.get('articles', [])

# 找到要删的文章
target = None
for a in articles:
    if a.get('slug') == name:
        target = a
        break

if not target:
    print(f'"{name}" not found in manifest. Nothing to do.')
    sys.exit(0)

# 删文件
filepath = os.path.join(ARTICLES_DIR, target['cat'], name + '.html')
if os.path.isfile(filepath):
    os.remove(filepath)
    print(f'Deleted: {filepath}')
else:
    print(f'File not on disk: {filepath}')

# 从 manifest 移除
data['articles'] = [a for a in articles if a.get('slug') != name]

with open(OUTPUT, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f'Removed "{name}" from manifest. {len(data["articles"])} articles remaining.')
