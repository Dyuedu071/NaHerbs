import re

with open('/home/duy/develop/NaHerbs/design/about.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract main tag content
main_match = re.search(r'<main[^>]*>(.*?)</main>', content, re.DOTALL)
if main_match:
    main_content = main_match.group(1)
    
    # Replace class= with className=
    jsx = main_content.replace('class="', 'className="')
    
    # Replace style="..." with style={{...}}
    # We only have one style attribute to convert:
    # style="background-image: url('...');"
    # Actually let's just do it manually with regex
    def style_replacer(match):
        style_val = match.group(1)
        if 'background-image' in style_val:
            url = re.search(r"url\('([^']+)'\)", style_val).group(1)
            return f"style={{{{ backgroundImage: `url('{url}')` }}}}"
        if 'font-variation-settings' in style_val:
            return f"style={{{{ fontVariationSettings: \"'FILL' 1\" }}}}"
        return f'style="{style_val}"'
    
    jsx = re.sub(r'style="([^"]+)"', style_replacer, jsx)
    
    # Fix HTML comments
    jsx = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', jsx)
    
    # Wrap in the Next.js component
    page_code = f"""import {{ Metadata }} from 'next';
import PublicHeader from '@/components/common/PublicHeader';
import PublicFooter from '@/components/common/PublicFooter';
import Image from 'next/image';

export const metadata: Metadata = {{
  title: 'Về NaHerbs | Tinh hoa thảo dược thiên nhiên',
  description: 'Tinh hoa thảo dược, chăm sóc sức khỏe từ thiên nhiên',
}};

export default function AboutPage() {{
  return (
    <div className="min-h-screen bg-background overflow-x-hidden flex flex-col">
      <PublicHeader />
      
      <main className="flex-grow pt-20">
{jsx}
      </main>

      <PublicFooter />
    </div>
  );
}}
"""
    with open('/home/duy/develop/NaHerbs/naherb-web/src/app/gioi-thieu/page.tsx', 'w', encoding='utf-8') as out:
        out.write(page_code)
    print("Success")
else:
    print("Could not find main tag")
