import { describe, expect, it } from "vitest";
import { Gimei } from "./Gimei.js";
import type { JapaneseNotation } from "./types.js";

function expectJapaneseNotation(value: JapaneseNotation) {
  expect(value.kanji).toBeTruthy();
  expect(value.hiragana).toBeTruthy();
  expect(value.katakana).toBeTruthy();
  expect(value.romaji).toBeTruthy();
}

describe("Gimei.person", () => {
  const gimei = new Gimei();

  it("returns a person with all notations and a gender", async () => {
    const person = await gimei.person();
    expectJapaneseNotation(person.firstName);
    expectJapaneseNotation(person.lastName);
    expectJapaneseNotation(person.fullName);
    expect(["male", "female"]).toContain(person.gender);
  });

  it("composes fullName by joining lastName and firstName with a space", async () => {
    const person = await gimei.person();
    expect(person.fullName.kanji).toBe(`${person.lastName.kanji} ${person.firstName.kanji}`);
    expect(person.fullName.hiragana).toBe(`${person.lastName.hiragana} ${person.firstName.hiragana}`);
    expect(person.fullName.katakana).toBe(`${person.lastName.katakana} ${person.firstName.katakana}`);
    expect(person.fullName.romaji).toBe(`${person.lastName.romaji} ${person.firstName.romaji}`);
  });

  it("respects the male gender option", async () => {
    for (let i = 0; i < 20; i++) {
      const person = await gimei.person({ gender: "male" });
      expect(person.gender).toBe("male");
    }
  });

  it("respects the female gender option", async () => {
    for (let i = 0; i < 20; i++) {
      const person = await gimei.person({ gender: "female" });
      expect(person.gender).toBe("female");
    }
  });

  it("produces some variation across calls", async () => {
    const results = await Promise.all(
      Array.from({ length: 30 }, () => gimei.person()),
    );
    const uniqueKanji = new Set(results.map((p) => p.fullName.kanji));
    expect(uniqueKanji.size).toBeGreaterThan(1);
  });
});

describe("Gimei.address", () => {
  const gimei = new Gimei();

  it("returns prefecture / city / town with all notations", async () => {
    const address = await gimei.address();
    expectJapaneseNotation(address.prefecture);
    expectJapaneseNotation(address.city);
    expectJapaneseNotation(address.town);
  });

  it("produces some variation across calls", async () => {
    const results = await Promise.all(
      Array.from({ length: 30 }, () => gimei.address()),
    );
    const uniqueKeys = new Set(
      results.map((a) => `${a.prefecture.kanji}/${a.city.kanji}/${a.town.kanji}`),
    );
    expect(uniqueKeys.size).toBeGreaterThan(1);
  });
});
