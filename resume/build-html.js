import React from 'react';
import ReactDOMServer from 'react-dom/server';
import uglifycss from 'uglifycss';

import { writeFileSync } from 'fs';

import { getJsonLdFromResume } from './src/resume.lib';

import { Resume } from './src/Resume';
import CV from './src/resume.json';

function getCssRaw(files) {
  return uglifycss.processFiles([].concat(files));
}

function getResumeMarkup(ResumeComponent, jsonResume, cssFiles) {
  const jsonLdResumeLd = getJsonLdFromResume(jsonResume);
  const jsonLdResumeLdRaw = JSON.stringify(jsonLdResumeLd);

  const css = getCssRaw(cssFiles);
  const resume = renderComponent(ResumeComponent, jsonResume);

  const SITE_NAME = 'enten.fr';
  const CANNONICAL_URL = 'http://www.enten.fr/steven/';

  const title = `${jsonResume.basics.name} | ${jsonResume.basics.label}`;
  const metaDescription = `Resume of ${jsonResume.basics.name}, a ${jsonResume.basics.label.toLowerCase()} who works for ${jsonResume.work[0].company}`;

  return '<!doctype html>' + renderComponent(
    () => (
      <html lang="en">
        <head>
          <title>{title}</title>
          <meta charSet="utf-8" />
          <meta name="description" content={metaDescription} />
          <link rel="canonical" href={CANNONICAL_URL} />
          <link rel="icon" href="favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="theme-color" content="#000000" />
          <meta property="og:title" content={title} />
          <meta property="og:site_name" content={SITE_NAME} />
          <meta property="og:url" content={CANNONICAL_URL} />
          <meta property="og:image" content={jsonResume.basics.picture} />
          <meta property="og:locale" content="en-EN" />
          <meta property="og:article:published_time" content="2005-01-01T00:00:00Z" />
          <meta property="og:article:modified_time" content={(new Date()).toISOString()} />
          <meta property="og:description" content={metaDescription} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{__html: jsonLdResumeLdRaw}} />
          <style dangerouslySetInnerHTML={{__html: css}} />
        </head>
        <body dangerouslySetInnerHTML={{__html: resume}} />
      </html>
    )
  );
}

function renderComponent(ReactComponent, props) {
  const element = React.createElement(ReactComponent, props);
  const raw = ReactDOMServer.renderToStaticMarkup(element);

  return raw;
}

const resumeHtml = getResumeMarkup(Resume, CV, './src/index.css');

writeFileSync('./steven.html', resumeHtml, 'utf-8');

console.log('write steven.html');
