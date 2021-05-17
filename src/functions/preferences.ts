interface Preference {
  [name: string]: string[];
}

const preferences: Preference = {
  Gilles: ["Italian", "Lebanese", "Japanese", "Belgian"],
  Vince: ["Italian", "Japanese", "Lebanese"],
  Sam: ["Belgian"],
  Klaas: ["Japanese", "Belgian"],
  Gaelle: ["Japanese", "Lebanese"],
};

export const getCuisineTypes = (types: CuisineCategory[]) => {
  return types.map((type: CuisineCategory) => type.title);
};

export const currentPreferences = (participants: Participant[]): string[][] => {
  return participants
    .filter((item) => item.isChecked)
    .map((user) => {
      return preferences[user.name];
    });
};

interface PreferenceRatio {
  [cuisine: string]: number;
}

export const currentPreferencesWithRatio = (
  currentPreferences: string[][]
): PreferenceRatio[] => {
  return currentPreferences.map((arrayOfPreferences) => {
    return arrayOfPreferences
      .reverse()
      .reduce((languageSet: PreferenceRatio, language: string) => {
        languageSet[language] =
          (arrayOfPreferences.indexOf(language) + 1) /
          arrayOfPreferences.length;
        return languageSet;
      }, {});
  });
};

export const currentPreferencesWithRatioTotal = (
  currentPreferencesWithRatio: PreferenceRatio[]
): PreferenceRatio => {
  const preferencesWithRatioTotal: PreferenceRatio = {};
  currentPreferencesWithRatio.forEach((arrayOfPrefs) => {
    Object.keys(arrayOfPrefs).forEach((language) => {
      preferencesWithRatioTotal[language] =
        (preferencesWithRatioTotal[language] || 0) + arrayOfPrefs[language];
    });
  });
  return preferencesWithRatioTotal;
};

export const getCurrentPreferences = (participants: Participant[]) => {
  const preferences = currentPreferences(participants);
  const preferencesWithRatio = currentPreferencesWithRatio(preferences);

  return currentPreferencesWithRatioTotal(preferencesWithRatio);
};
