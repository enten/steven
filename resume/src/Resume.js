import React from 'react';

export function Resume(props) {
  const {
    basics = {},
    work = [],
    volunteer = [],
    education = [],
    skills = [],
    languages = [],
    interests = [],
    awards = [],
    publications = [],
  } = props;

  return (
    <main>
      <article>
        <ResumeBasics {...basics} />
        <section className="resume-work">
          <h2>Work</h2>
          <div>
            {work.map((work, index) => (
              <ResumeWork key={index} {...work} />
            ))}
          </div>
        </section>
        <section className="resume-volunteer">
          <h2>Volunteer</h2>
          <div>
            {volunteer.map((volunteer, index) => (
              <ResumeVolunteer key={index} {...volunteer} />
            ))}
          </div>
        </section>
        <aside>
          <section className="resume-education">
            <h2>Education</h2>
            <ul>
              {education.map((education, index) => (
                <ResumeEducation key={index} {...education} />
              ))}
            </ul>
          </section>
          <section className="resume-skills">
            <h2>Skills</h2>
            <div>
              {skills.map((skill, index) => (
                <ResumeSkill key={index} {...skill} />
              ))}
            </div>
          </section>
          <section className="resume-languages">
            <h2>Languages</h2>
            <ul>
              {languages.map((language, index) => (
                <ResumeLanguage key={index} {...language} />
              ))}
            </ul>
          </section>
          <section className="resume-awards">
            <h2>Awards</h2>
            <ul>
              {awards.map((award, index) => (
                <ResumeAward key={index} {...award} />
              ))}
            </ul>
          </section>
          <section className="resume-publications">
            <h2>Publications</h2>
            <ul>
              {publications.map((publication, index) => (
                <ResumePublication key={index} {...publication} />
              ))}
            </ul>
          </section>
          <section className="resume-interests">
            <h2>Interests</h2>
            <ul>
              {interests.map((interest, index) => (
                <ResumeInterest key={index} {...interest} />
              ))}
            </ul>
          </section>
        </aside>
      </article>
    </main>
  );
}

export function ResumeAward(props) {
  const {
    title,
    date,
    awarder,
    summary
  } = props;

  return (
    <li>
      <time dateTime={date}>{date}</time>
      {': '}
      {title}
    </li>
  );
}

export function ResumeBasics(props) {
  const {
    name,
    label,
    picture,
    summary,
    phone,
    email,
    website,
    location,
    profiles
  } = props;

  return (
    <header className="resume-basics">
      <h1>{name}</h1>
      <div className="resume-basics-picture">
        <img src={picture} alt={'Photo of ' + name} />
      </div>
      <h2>{label}</h2>
      <address className="resume-basics-contact">
        <dl>
          <dt>email</dt>
          <dd><a href={'mailto:' + email}>{email}</a></dd>
          <dt>website</dt>
          <dd><a href={website}>{humanizeUrl(website)}</a></dd>
          {profiles.map(profile => [
            <dt>{profile.network}</dt>,
            <dd><a rel="me" href={profile.url}>{humanizeUrl(profile.url)}</a></dd>
          ])}
          <dt>phone</dt>
          <dd><a href={'tel:' + phone}>{phone}</a></dd>
        </dl>
      </address>
      <p className="resume-basics-summary">{summary}</p>
    </header>
  );
}

export function ResumeEducation(props) {
  const {
    institution,
    area,
    studyType,
    startDate,
    endDate
  } = props;

  return (
    <li>
      <span>
        <time dateTime={startDate}>{startDate}</time>
        {' - '}
        {endDate ? <time dateTime={endDate}>{endDate}</time> : 'Present'}
      </span>
      {': '}
      <span>{studyType} {area}</span>
      {' at '}
      <span>{institution}</span>
    </li>
  );
}

export function ResumeInterest(props) {
  const {
    name,
    keywords
  } = props;

  return (
    <li>{name}</li>
  );
}

export function ResumeLanguage(props) {
  const {
    language,
    fluency
  } = props;

  return (
    <li>{language}: {fluency}</li>
  );
}

export function ResumePublication(props) {
  const {
    name,
    publisher,
    releaseDate,
    website,
    summary
  } = props;

  return (
    <li>
      <time dateTime={releaseDate}>{releaseDate}</time>
      {': '}
      <a href={website}>{name}</a>
    </li>
  );
}

export function ResumeSkill(props) {
  const {
    name,
    level,
    keywords
  } = props;

  return (
    <div>
      <h3>{name}</h3>
      <ul>
        {keywords.map(keyword => (<li key={keyword}>{keyword}</li>))}
      </ul>
    </div>
  );
}

export function ResumeVolunteer(props) {
  const {
    organization,
    website,
    position,
    startDate,
    endDate,
    summary,
    highlights
  } = props;

  return (
    <div>
      <h3>
        <span>
          <time dateTime={startDate}>{startDate}</time>
          {' - '}
          {endDate ? <time dateTime={endDate}>{endDate}</time> : 'Present'}
        </span>
        {': '}
        <span>
          {position} of <a href={website}>{organization}</a>
        </span>
      </h3>
      <p>{summary}</p>
      <ul>
        {highlights.map(highlight => (<li key={highlight}>{highlight}</li>))}
      </ul>
    </div>
  );
}

export function ResumeWork(props) {
  const {
    position,
    company,
    location,
    website,
    startDate,
    endDate,
    summary,
    highlights
  } = props;

  return (
    <div>
      <h3>
        <span>
          <time dateTime={startDate}>{startDate}</time>
          {' - '}
          {endDate ? <time dateTime={endDate}>{endDate}</time> : 'Present'}
        </span>
        {': '}
        <span>
          <a href={website}>{company}</a> at {location.city}
        </span>
      </h3>
      <p>
      </p>
      <p>{summary}</p>
      <ul>
        {highlights.map(highlight => (<li key={highlight}>{highlight}</li>))}
      </ul>
    </div>
  );
}

export function humanizeUrl(url) {
  const protocolSeparatorIndex = url.indexOf('://');

  if (protocolSeparatorIndex !== -1) {
    url = url.substring(protocolSeparatorIndex + 3);
  }

  if (url.endsWith('/')) {
    url = url.substring(0, url.length - 1);
  }

  return url;
}
