export function getJsonLdFromResume(jsonResume) {
  const {
    basics = {},
    work = [],
    awards = [],
    education = [],
    interests = [],
    languages = [],
    publications = [],
    skills = [],
    volunteer = []
  } = jsonResume;

  const id = getJsonLdId(basics.name);

  const currentJob = work[0];
  const pastJobs = work.slice(1);

  return {
    '@context': 'http://schema.org/',
    '@type': 'Person',
    '@id': id,
    name: basics.name,
    jobTitle: currentJob.position,
    url: basics.website,
    image: basics.picture,
    email: basics.email,
    telephone: basics.phone,
    birthDate: basics.birthDate,
    nationality: basics.nationality,
    description: basics.summary,
    contactPoint: (basics.profiles || []).map(getJsonLdFromResumeBasicsProfile),
    address: getJsonLdFromResumeLocation(basics.location, 'home'),
    worksFor: {
      '@type': 'Organization',
      '@id': `work/${getJsonLdId(currentJob.company)}`,
      name: currentJob.company,
      url: currentJob.website,
      description: currentJob.summary,
      location: getJsonLdFromResumeNamedLocation(currentJob.location, currentJob.company)
    },
    potentialAction: [
      ...skills.map(getJsonLdFromResumeSkill),
      ...languages.map(getJsonLdFromResumeLanguage),
      ...interests.map(getJsonLdFromResumeInterest)
    ],
    performerIn: [
      ...pastJobs.map(getJsonLdFromResumeWork.bind(null, id)),
      ...volunteer.map(getJsonLdFromResumeVolunteer.bind(null, id)),
      ...education.map(getJsonLdFromResumeEducation.bind(null, id)),
      ...publications.map(getJsonLdFromResumePublication.bind(null, id))
    ],
    award: awards.map(award => award.title)
  };
}

export function getJsonLdId(value) {
  return new String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(' ')
    .join('-');
}

export function getJsonLdFromResumeBasicsProfile(profile) {
  return {
    '@type': 'ContactPoint',
    '@id': `profile/${profile.network}`,
    name: profile.network,
    contactType: 'technical support',
    identifier: profile.username,
    url: profile.url
  };
}

export function getJsonLdFromResumeEducation(performerId, education) {
  return {
    '@type': 'EducationEvent',
    '@id': `education/${getJsonLdId(education.studyType)}-${getJsonLdId(education.area)}`,
    name: education.studyType,
    description: education.area,
    startDate: education.startDate,
    endDate: education.endDate,
    location: getJsonLdFromResumeNamedLocation(education.location, education.institution),
    performer: { id: performerId }
  };
}

export function getJsonLdFromResumeInterest(interest) {
  return {
    '@type': 'AchieveAction',
    '@id': `interest/${getJsonLdId(interest.name)}`,
    'name': `${interest.name} interest`,
    'description': interest.keywords && interest.keywords.join(', ')
  };
}

export function getJsonLdFromResumeHighlight(highlight) {
  return {
    '@type': 'CreativeWork',
    name: highlight
  };
}

export function getJsonLdFromResumeLanguage(language) {
  return {
    '@type': 'AchieveAction',
    '@id': `language/${getJsonLdId(language.language)}`,
    'name': `${language.language} language (${language.fluency})`
  };
}

export function getJsonLdFromResumeLocation(location) {
  return {
    '@type': 'PostalAddress',
    addressCountry: location.countryCode,
    addressLocality: location.city,
    addressRegion: location.region,
    postalCode: location.postalCode,
    streetAddress: location.address
	};
}

export function getJsonLdFromResumeNamedLocation(location, name, url) {
  return {
    '@type': 'Place',
    '@id': getJsonLdId(name),
    name,
    url,
    address: getJsonLdFromResumeLocation(location)
	};
}

export function getJsonLdFromResumePublication(performerId, publication) {
  return {
    '@type': 'PublicationEvent',
    '@id': `publication/${getJsonLdId(publication.name)}`,
    name: publication.name,
    url: publication.website,
    startDate: publication.releaseDate,
    location: getJsonLdFromResumeNamedLocation(publication.location, publication.publisher),
    description: publication.summary,
    performer: { id: performerId }
  };
}

export function getJsonLdFromResumeSkill(skill) {
  return {
    '@type': 'AchieveAction',
    '@id': `skill/${getJsonLdId(skill.name)}`,
    'name': `${skill.name} (${skill.level})`,
    'description': skill.keywords && skill.keywords.join(', ')
  };
}

export function getJsonLdFromResumeVolunteer(performerId, volunteer) {
  return {
    '@type': 'Event',
    '@id': `volunteer/${getJsonLdId(volunteer.position)}-${getJsonLdId(volunteer.organization)}`,
    name: `${volunteer.position} of ${volunteer.organization}`,
    url: volunteer.website,
    description: volunteer.summary,
    startDate: volunteer.startDate,
    endDate: volunteer.endDate,
    location: getJsonLdFromResumeNamedLocation(volunteer.location, volunteer.organization),
    workFeatured: (volunteer.highlights || []).map(getJsonLdFromResumeHighlight),
    performer: { id: performerId }
  };
}

export function getJsonLdFromResumeWork(performerId, work) {
  return {
    '@type': 'BusinessEvent',
    '@id': `work/${getJsonLdId(work.company)}`,
    name: work.position,
    description: work.summary,
    startDate: work.startDate,
    endDate: work.endDate,
    location: getJsonLdFromResumeNamedLocation(work.location, work.company, work.website),
    workFeatured: (work.highlights || []).map(getJsonLdFromResumeHighlight),
    performer: { id: performerId }
  }
}

