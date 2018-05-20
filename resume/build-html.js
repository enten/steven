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

  return '<!doctype html>' + renderComponent(
    () => (
      <html lang="en">
        <head>
          <title>{jsonResume.basics.name} | {jsonResume.basics.label}</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <link rel="icon" href="favicon.ico" />
          <meta name="theme-color" content="#000000" />
          <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" />
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
