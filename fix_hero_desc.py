import os

path = r"d:\video shoot\mine\tug of war website copy\tug of war website copy\index.html"

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the specific tag
content = content.replace('<p class="hero-desc">', '<p class="hero-desc" style="color: var(--accent-gold);">')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch Applied")
