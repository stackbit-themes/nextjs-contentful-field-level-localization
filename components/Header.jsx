import Link from 'next/link';
import { LocaleSwitcher } from './LocaleSwitcher';

// Always show the homepage link first
function sortedLinksArray(links) {
  if (!links) return [];

  const linksArray = Object.entries(links);
  const hpLink = linksArray.find(([label, url]) => url === '/');
  const restOfLinks = linksArray.filter(([label, url]) => url !== '/');
  return [hpLink, ...restOfLinks];
}

export const Header = ({ pageLocale, siteConfig, links }) => {
  let sortedLinks = sortedLinksArray(links);
  const headerText = siteConfig?.headerText;
  return (
    <div className="bg-gray-800 text-white px-5 py-4 flex items-center gap-6 uppercase">
      {headerText && (
        <span className="hidden md:inline text-lg font-bold" data-sb-field-path={siteConfig.id + ':headerText'}>
          {headerText}
        </span>
      )}
      <span className="flex flex-grow gap-3 md:gap-5">
        {sortedLinks.map(([label, url]) => {
          return (
            <Link key={url} href={url} locale={pageLocale}>
              <span className="text-md">{label}</span>
            </Link>
          );
        })}
      </span>
      <LocaleSwitcher pageLocale={pageLocale} />
    </div>
  );
};
