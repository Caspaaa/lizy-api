import {
  currentPreferences,
  currentPreferencesWithRatio,
  currentPreferencesWithRatioTotal,
} from "./searchController";

describe("currentPreferences()", () => {
  test("when empty participants array returns empty preferences array", () => {
    expect(currentPreferences([])).toEqual([]);
  });

  test("when there is one participant that has isChecked set to false, returns empty preferences array", () => {
    const participants = { name: "Gilles", isChecked: false };

    expect(currentPreferences([participants])).toEqual([]);
  });

  test("when there is one participant that has isChecked set to true, returns his preferences array", () => {
    const participants = { name: "Gilles", isChecked: true };
    const preferences = ["Italian", "Lebanese", "Japanese", "Belgian"];

    expect(currentPreferences([participants])).toEqual([preferences]);
  });

  test("when there is multiple participants that has isChecked, returns their preferences arrays", () => {
    const participants = [
      { name: "Gilles", isChecked: true },
      { name: "Vince", isChecked: true },
      { name: "Sam", isChecked: true },
    ];
    const preferences = [
      ["Italian", "Lebanese", "Japanese", "Belgian"],
      ["Italian", "Japanese", "Lebanese"],
      ["Belgian"],
    ];

    expect(currentPreferences(participants)).toEqual(preferences);
  });

  test("when there is some participants that have isChecked and some that doesn't have, returns the preferences arrays of the isChecked only", () => {
    const participants = [
      { name: "Gilles", isChecked: true },
      { name: "Vince", isChecked: false },
      { name: "Sam", isChecked: true },
    ];
    const preferences = [
      ["Italian", "Lebanese", "Japanese", "Belgian"],
      ["Belgian"],
    ];

    expect(currentPreferences(participants)).toEqual(preferences);
  });
});

describe("currentPreferencesWithRatio()", () => {
  test("empty preferences array returns empty preferences array with ratio", () => {
    expect(currentPreferencesWithRatio([])).toEqual([]);
  });

  test("single valued preferences array returns its corresponding preferences array with ratio", () => {
    const preferences = [["Italian", "Japanese", "Lebanese"]];

    const preferencesWithRatio = [
      { Italian: 1, Japanese: 2 / 3, Lebanese: 1 / 3 },
    ];

    expect(currentPreferencesWithRatio(preferences)).toEqual(
      preferencesWithRatio
    );
  });

  test("multiple preferences array returns corresponding preferences array with ratio", () => {
    const preferences = [
      ["Italian", "Lebanese", "Japanese", "Belgian"],
      ["Italian", "Japanese", "Lebanese"],
      ["Belgian"],
    ];

    const preferencesWithRatio = [
      {
        Italian: 1,
        Lebanese: 3 / 4,
        Japanese: 1 / 2,
        Belgian: 1 / 4,
      },
      { Italian: 1, Japanese: 2 / 3, Lebanese: 1 / 3 },
      { Belgian: 1 },
    ];

    expect(currentPreferencesWithRatio(preferences)).toEqual(
      preferencesWithRatio
    );
  });
});

describe("currentPreferencesWithRatioTotal()", () => {
  test("empty array of preferences with ratio returns empty object", () => {
    expect(currentPreferencesWithRatioTotal([])).toEqual({});
  });

  test("single preference with ratio returns total of them", () => {
    const preferencesWithRatio = [{ Belgian: 1 }, { Belgian: 2 }];

    const preferencesWithRatioTotal = {
      Belgian: 3,
    };

    expect(currentPreferencesWithRatioTotal(preferencesWithRatio)).toEqual(
      preferencesWithRatioTotal
    );
  });

  test("multiple preferences with ratio return unique set of preferences with the total as value", () => {
    const preferencesWithRatio: any = [
      {
        Italian: 1,
        Lebanese: 3 / 4,
        Japanese: 1 / 2,
        Belgian: 1 / 4,
      },
      { Italian: 1, Japanese: 2 / 3, Lebanese: 1 / 3 },
      { Belgian: 1 },
    ];

    const preferencesWithRatioTotal = {
      Italian: 2,
      Lebanese: 3 / 4 + 1 / 3,
      Japanese: 1 / 2 + 2 / 3,
      Belgian: 1 + 1 / 4,
    };

    expect(currentPreferencesWithRatioTotal(preferencesWithRatio)).toEqual(
      preferencesWithRatioTotal
    );
  });
});
