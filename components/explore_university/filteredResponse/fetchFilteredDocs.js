import { getDocs, limit, query, where } from 'firebase/firestore';

const shuffle = (array) => {
  const values = [...array];
  for (let index = values.length - 1; index > 0; index -= 1) {
    const swapWith = Math.floor(Math.random() * (index + 1));
    [values[index], values[swapWith]] = [values[swapWith], values[index]];
  }
  return values;
};

const prefixBounds = (value) => {
  if (!value) {
    return ['abcdefghijklmonpqrstuvwxyz', ''];
  }
  return [value, `${value}z`];
};

const hasLevels = (levels) => Array.isArray(levels) && levels.length > 0;

const fetchFilteredDocs = async ({
  docref,
  intake,
  country,
  duration,
  level,
  course,
}) => {
  const intakePrefix = intake?.substr(0, 3) || '';
  const [intakeMin, intakeMax] = prefixBounds(intakePrefix);
  const [courseMin, courseMax] = prefixBounds(course || '');

  const levelValues = hasLevels(level) ? level : ['random value'];

  const intakeref = query(
    docref,
    where('Intakes', '>=', intakeMin),
    where('Intakes', '<', intakeMax),
    limit(100),
  );
  const countryref = query(docref, where('Country', '==', country), limit(100));
  const courseref = query(
    docref,
    where('Name', '>=', course),
    where('Name', '<', `${course}z`),
    where('Name', '==', course),
    limit(100),
  );
  const univref = query(
    docref,
    where('University', '>=', courseMin || 'abcdefghijklmnopqrstuvwxyz'),
    where('University', '<', courseMax),
    limit(100),
  );
  const levelref = query(
    docref,
    where('Studylvl', 'in', levelValues),
    limit(100),
  );
  const durationref = query(
    docref,
    where('Duration', '==', duration),
    limit(100),
  );
  const durationCntref = query(
    docref,
    where('Duration', '==', duration),
    where('Country', '==', country),
    limit(100),
  );
  const durationLevelref = query(
    docref,
    where('Duration', '==', duration),
    where('Studylvl', 'in', levelValues),
    limit(100),
  );
  const durationIntakeref = query(
    docref,
    where('Intakes', '>=', intakeMin),
    where('Intakes', '<', intakeMax),
    where('Duration', '==', duration),
    limit(100),
  );
  const cntIntakeref = query(
    docref,
    where('Intakes', '>=', intakeMin),
    where('Intakes', '<', intakeMax),
    where('Country', '==', country),
    limit(100),
  );
  const cntLevelref = query(
    docref,
    where('Studylvl', 'in', levelValues),
    where('Country', '==', country),
    limit(100),
  );
  const levelIntakeref = query(
    docref,
    where('Studylvl', 'in', levelValues),
    where('Country', '==', country),
    where('Intakes', '>=', intakeMin),
    where('Intakes', '<', intakeMax),
    limit(100),
  );
  const intakeCntDurationref = query(
    docref,
    where('Intakes', '>=', intakeMin),
    where('Intakes', '<', intakeMax),
    where('Country', '==', country),
    where('Duration', '==', duration),
    limit(100),
  );
  const inatakeDurationLevelref = query(
    docref,
    where('Intakes', '>=', intakeMin),
    where('Intakes', '<', intakeMax),
    where('Studylvl', 'in', levelValues),
    where('Duration', '==', duration),
    limit(100),
  );
  const cntDurationLevelref = query(
    docref,
    where('Studylvl', 'in', levelValues),
    where('Country', '==', country),
    where('Duration', '==', duration),
    limit(100),
  );
  const inatakeCountryLevelref = query(
    docref,
    where('Studylvl', 'in', levelValues),
    where('Intakes', '<', intakeMax),
    where('Intakes', '<', intakeMax),
    where('Country', '==', country),
    limit(100),
  );
  const intakeDurationCntLevel = query(
    docref,
    where('Studylvl', 'in', levelValues),
    where('Intakes', '<', intakeMax),
    where('Intakes', '<', intakeMax),
    where('Country', '==', country),
    where('Duration', '==', duration),
    limit(100),
  );

  const nonEmptyIntake = intake !== '';
  const nonEmptyCountry = country !== '';
  const nonDefaultDuration = duration !== -1;
  const nonEmptyCourse = course !== '';
  const hasStudyLevels = hasLevels(level);

  if (
    nonEmptyIntake &&
    nonEmptyCountry &&
    nonDefaultDuration &&
    hasStudyLevels
  ) {
    const snapshot = await getDocs(intakeDurationCntLevel);
    return shuffle(snapshot.docs);
  }
  if (nonEmptyIntake && nonEmptyCountry && nonDefaultDuration) {
    const snapshot = await getDocs(intakeCntDurationref);
    return shuffle(snapshot.docs);
  }
  if (nonEmptyCountry && nonDefaultDuration && hasStudyLevels) {
    const snapshot = await getDocs(cntDurationLevelref);
    return shuffle(snapshot.docs);
  }
  if (nonEmptyIntake && nonDefaultDuration && hasStudyLevels) {
    const snapshot = await getDocs(inatakeDurationLevelref);
    return shuffle(snapshot.docs);
  }
  if (nonEmptyIntake && nonEmptyCountry && hasStudyLevels) {
    const snapshot = await getDocs(inatakeCountryLevelref);
    return shuffle(snapshot.docs);
  }
  if (nonEmptyIntake && nonEmptyCountry) {
    const snapshot = await getDocs(cntIntakeref);
    return shuffle(snapshot.docs);
  }
  if (nonEmptyIntake && nonDefaultDuration) {
    const snapshot = await getDocs(durationIntakeref);
    return shuffle(snapshot.docs);
  }
  if (nonEmptyIntake && hasStudyLevels) {
    const snapshot = await getDocs(levelIntakeref);
    return shuffle(snapshot.docs);
  }
  if (nonEmptyCountry && nonDefaultDuration) {
    const snapshot = await getDocs(durationCntref);
    return shuffle(snapshot.docs);
  }
  if (nonEmptyCountry && hasStudyLevels) {
    const snapshot = await getDocs(cntLevelref);
    return shuffle(snapshot.docs);
  }
  if (nonDefaultDuration && hasStudyLevels) {
    const snapshot = await getDocs(durationLevelref);
    return shuffle(snapshot.docs);
  }
  if (nonEmptyCourse) {
    const [courseSnap, universitySnap] = await Promise.all([
      getDocs(courseref),
      getDocs(univref),
    ]);
    return shuffle(courseSnap.docs.concat(universitySnap.docs));
  }
  if (nonEmptyIntake) {
    const snapshot = await getDocs(intakeref);
    return shuffle(snapshot.docs);
  }
  if (nonEmptyCountry) {
    const snapshot = await getDocs(countryref);
    return shuffle(snapshot.docs);
  }
  if (nonDefaultDuration) {
    const snapshot = await getDocs(durationref);
    return shuffle(snapshot.docs);
  }
  if (hasStudyLevels) {
    const snapshot = await getDocs(levelref);
    return shuffle(snapshot.docs);
  }

  const [courseSnap, universitySnap] = await Promise.all([
    getDocs(courseref),
    getDocs(univref),
  ]);
  return shuffle(courseSnap.docs.concat(universitySnap.docs));
};

export default fetchFilteredDocs;
