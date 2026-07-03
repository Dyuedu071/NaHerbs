import re

with open('/home/duy/develop/NaHerbs/design/contact.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract main tag content
main_match = re.search(r'<main[^>]*>(.*?)</main>', content, re.DOTALL)
if main_match:
    main_content = main_match.group(1)
    
    # Replace class= with className=
    jsx = main_content.replace('class="', 'className="')
    
    def style_replacer(match):
        style_val = match.group(1)
        if 'background-image' in style_val:
            url = re.search(r"url\('([^']+)'\)", style_val).group(1)
            return f"style={{{{ backgroundImage: `url('{url}')` }}}}"
        if 'font-variation-settings' in style_val:
            return f"style={{{{ fontVariationSettings: \"'FILL' 1\" }}}}"
        return f'style="{style_val}"'
    
    jsx = re.sub(r'style="([^"]+)"', style_replacer, jsx)
    
    # Replace img tags with Image components
    def img_replacer(match):
        attrs = match.group(1)
        # ensure it's self-closing
        if not attrs.endswith('/'):
            attrs += ' /'
        
        # We can just change it to Next.js Image or keep it as img since it's just one image. 
        # Actually I will use Image fill. But since the regex might be tricky, let's keep it as is
        # and manually fix it in a second pass.
        return f'<img {attrs}>'
    
    # Actually just replacing data-alt is enough for now, I'll use sed/multi_replace later.
    
    jsx = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', jsx)
    
    # Dynamic values replacement
    # 1900 1234 -> {contactPhone}
    jsx = jsx.replace('1900 1234', '{contactPhone}')
    # support@naherbs.vn -> {contactEmail}
    jsx = jsx.replace('support@naherbs.vn', '{contactEmail}')
    # 123 Đường Thảo Mộc, Quận 1, TP. Hồ Chí Minh, Việt Nam -> {address}
    jsx = jsx.replace('123 Đường Thảo Mộc, Quận 1, TP. Hồ Chí Minh, Việt Nam', '{address}')
    # For Zalo, the text says "Zalo: NaHerbs Official". I'll leave it or bind it if there's a field.
    
    # Fix the form onsubmit
    jsx = re.sub(r'onsubmit="[^"]*"', '', jsx)
    
    page_code = f"""import {{ Metadata }} from 'next';
import {{ getSiteSettingsPublic }} from '@/services/generated/seo/seo';
import PublicHeader from '@/components/common/PublicHeader';
import PublicFooter from '@/components/common/PublicFooter';
import Image from 'next/image';

export const metadata: Metadata = {{
  title: 'Liên hệ | NaHerbs',
  description: 'Liên hệ với NaHerbs để được tư vấn về các sản phẩm thảo dược và chăm sóc sức khỏe.',
}};

export default async function ContactPage() {{
  const siteSettings = await getSiteSettingsPublic().catch(() => null);
  
  let settingsData: any = {{}};
  if (siteSettings && typeof siteSettings === 'object' && 'data' in siteSettings) {{
    settingsData = (siteSettings as any).data || {{}};
  }} else if (siteSettings) {{
    settingsData = siteSettings;
  }}

  const {{
    contactEmail = 'contact@naherbs.vn',
    contactPhone = '0988 123 456',
    address = '123 Đường Mẫu, Quận 1, TP. Hồ Chí Minh',
  }} = settingsData;

  return (
    <div className="min-h-screen bg-surface-container-lowest flex flex-col">
      <PublicHeader />
      
      <main className="flex-grow pt-xl pb-xl mt-20 relative">
{jsx}
      </main>

      <PublicFooter />
    </div>
  );
}}
"""
    with open('/home/duy/develop/NaHerbs/naherb-web/src/app/lien-he/page.tsx', 'w', encoding='utf-8') as out:
        out.write(page_code)
    print("Success")
else:
    print("Could not find main tag")
