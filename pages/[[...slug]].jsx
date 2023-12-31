import Head from 'next/head';
import { Header } from '../components/Header';
import { getPages, getPagePaths, getSiteConfig } from '../utils/content';
import localization from '../utils/localization';
import { IS_DEV, normalizeSlug } from '../utils/common';
import { componentMap } from '../components';

export default function ComposablePage({ page, pageLocale, siteConfig, headerLinks }) {
  return (
    <>
      <Head>
        <title>{page.title}</title>
      </Head>
      <Header pageLocale={pageLocale} links={headerLinks} siteConfig={siteConfig} />
      <div data-sb-object-id={page.id}>
        {page.sections?.length ? (
          page.sections.map((section, idx) => {
            const Component = componentMap[section.type];
            return <Component key={idx} {...section} />;
          })
        ) : (
          <EmptyState />
        )}
      </div>
    </>
  );
}

function EmptyState() {
  return IS_DEV ? (
    <div className="flex items-center justify-center w-full py-32">
      <div className="border-4 border-gray-400 rounded p-16 border-dashed flex flex-col gap-2 items-center">
        <span className="text-2xl">Empty page! add sections.</span>
        <span>(this message does not appear in production)</span>
      </div>
    </div>
  ) : (
    <></>
  );
}

export async function getStaticPaths({ locales }) {
  const paths = await getPagePaths(locales);
  return { paths, fallback: false };
}

export async function getStaticProps({ params, locale }) {
  const slug = '/' + (params?.slug ?? ['']).join('/');
  const pageLocale = locale || localization.defaultLocale;

  const [siteConfig, allPages] = await Promise.all([getSiteConfig(pageLocale), getPages(pageLocale)]);
  const page = allPages.find((e) => normalizeSlug(e.slug) === slug);
  if (!page) {
    console.warn('Did not find page for:', params);
    return { notFound: true };
  }

  return { props: { page, pageLocale, siteConfig, headerLinks: linksToAllPages(allPages) } };
}

function linksToAllPages(pages) {
  return Object.fromEntries(
    pages.map((e) => [e.title, normalizeSlug(e.slug)]),
  );
}
