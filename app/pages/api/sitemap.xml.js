import { request } from 'graphql-request';

let xml = '';
xml += '<?xml version="1.0" encoding="UTF-8"?>';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

const SITEMAP_QUERY = `{
  allPosts (
    where: {status: published}
  ) {
    slug
  }
}`;

const Sitemap = (req, res) => {

  const siteOrigin = `https://${req.hostname}/`;

  xml += `<url>`;
  xml += `<loc>${siteOrigin}</loc>`;
  xml += `<changefreq>monthly</changefreq>`;
  xml += `<priority>0.8</priority>`;
  xml += `</url>`;

  request('http://localhost:3000/admin/api', SITEMAP_QUERY).then(data => {
    if (data && data.allPosts) {
      data.allPosts.forEach(postObj => {
        xml += `<url>`;
        xml += `<loc>${siteOrigin}post/${postObj.slug}</loc>`;
        xml += `<changefreq>monthly</changefreq>`;
        xml += `<priority>0.8</priority>`;
        xml += `</url>`;
      });
    }

    xml += '</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

};

export default Sitemap;