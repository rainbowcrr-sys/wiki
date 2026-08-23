#!/usr/bin/env python3
import os
import json
import re
from datetime import date

ARTICLES_DIR = 'articles'
OUTPUT = 'manifest.json'

def extract_title(html_content, fallback):
    """从 HTML 内容里提取第一个 <h1> 的文本内容"""
    match = re.search(r'<h1[^>]*>(.*?)</h1>', html_content, re.DOTALL | re.IGNORECASE)
    if match:
        # 去掉可能的标签嵌套，只取文本
        text = re.sub(r'<[^>]+>', '', match.group(1)).strip()
        return text if text else fallback
    return fallback

def extract_date(html_content):
    """尝试从内容里提取日期，找不到就返回今天"""
    # 匹配 YYYY-MM-DD 格式
    match = re.search(r'\b(\d{4}-\d{2}-\d{2})\b', html_content)
    if match:
        return match.group(1)
    return str(date.today())

def main():
    articles = []

    if not os.path.isdir(ARTICLES_DIR):
        print(f"No {ARTICLES_DIR}/ directory found, writing empty manifest.")
        with open(OUTPUT, 'w') as f:
            json.dump({"articles": []}, f, indent=2)
        return

    # 遍历 articles/ 下的每个子目录（分类）
    for cat in sorted(os.listdir(ARTICLES_DIR)):
        cat_path = os.path.join(ARTICLES_DIR, cat)
        if not os.path.isdir(cat_path) or cat.startswith('.'):
            continue

        # 遍历分类下的每个 .html 文件
        for filename in sorted(os.listdir(cat_path)):
            if not filename.endswith('.html') or filename.startswith('.'):
                continue

            slug = filename[:-5]  # 去掉 .html
            filepath = os.path.join(cat_path, filename)

            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
            except Exception as e:
                print(f"  Skipping {filepath}: {e}")
                continue

            title = extract_title(content, slug.replace('-', ' ').title())
            pub_date = extract_date(content)

            articles.append({
                "cat": cat,
                "slug": slug,
                "title": title,
                "date": pub_date
            })
            print(f"  Found: {cat}/{slug} -> {title}")

    # 写入 manifest.json
    with open(OUTPUT, 'w', encoding='utf-8') as f:
        json.dump({"articles": articles}, f, indent=2, ensure_ascii=False)

    print(f"\nDone! Generated manifest.json with {len(articles)} articles.")

if __name__ == '__main__':
    main()
