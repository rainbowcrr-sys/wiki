#!/usr/bin/env python3
import os
import json
import re
import sys
from datetime import date

ARTICLES_DIR = 'articles'
OUTPUT = 'manifest.json'

name = os.environ.get('ARTICLE_NAME', '').strip()
if not name:
    print('ERROR: article_name input is empty.')
    sys.exit(1)

# 1. 读取当前 manifest，找到要删的文章
with open(OUTPUT, 'r', encoding='utf-8') as f:
    data = json.load(f)

articles = data.get('articles', [])
target = None
for a in articles:
    if a.get('slug') == name:
        target = a
        break

if not target:
    print(f'Article with slug "{name}" not found in manifest.json. Nothing to delete.')
    sys.exit(0)

cat = target['cat']
filepath = os.path.join(ARTICLES_DIR, cat, name + '.html')

# 2. 删除对应的 .html 文件
if os.path.isfile(filepath):
    os.remove(filepath)
    print(f'Deleted file: {filepath}')
else:
    print(f'File not found on disk: {filepath} (will still remove from manifest)')

# 3. 从 articles 列表中移除
new_articles = [a for a in articles if a.get('slug') != name]
data['articles'] = new_articles

with open(OUTPUT, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f'Removed "{name}" from manifest.json ({len(new_articles)} articles remaining)')

# 4. 重新扫描目录，确保 manifest 与磁盘完全一致（兜底）
def extract_title(content, fallback):
    m = re.search(r'<h1[^>]*>(.*?)</h1>', content, re.DOTALL | re.IGNORECASE)
    if m:
        t = re.sub(r'<[^>]+>', '', m.group(1)).strip()
        return t if t else fallback
    return fallback

def extract_date(content):
    m = re.search(r'\b(\d{4}-\d{2}-\d{2})\b', content)
    return m.group(1) if m else str(date.today())

refreshed = []
for c in sorted(os.listdir(ARTICLES_DIR)):
    cp = os.path.join(ARTICLES_DIR, c)
    if not os.path.isdir(cp) or c.startswith('.'):
        continue
    for fn in sorted(os.listdir(cp)):
        if not fn.endswith('.html') or fn.startswith('.'):
            continue
        slug = fn[:-5]
        fp = os.path.join(cp, fn)
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()
        refreshed.append({
            'cat': c,
            'slug': slug,
            'title': extract_title(content, slug.replace('-', ' ').title()),
            'date': extract_date(content)
        })

with open(OUTPUT, 'w', encoding='utf-8') as f:
    json.dump({'articles': refreshed}, f, indent=2, ensure_ascii=False)

print(f'Refreshed manifest.json: {len(refreshed)} articles total.')
