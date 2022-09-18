const puppeteer = require("puppeteer");
const fs = require("fs");

const NAME = "NAME";
const DATE_RECOGNIZED = "DATE RECOGNIZED";
const STATUS = "STATUS";
const COUNCIL_DISTRICT = "COUNCIL DISTRICT";
const MAYORS_ASSISTANCE_OFFICE = "MAYOR’S ASSISTANCE OFFICE";
const CONTACT_AND_MEETING_INFORMATION = "CONTACT AND MEETING INFORMATION";
const Location = "Location";
const LOCARION = "LOCRRION";
const LOCATATION = "LOCATATION";
const LOCATION = "LOCATION";
const COMMUNITY_DESCRIPTION_AND_HISTORY = "COMMUNITY DESCRIPTION AND HISTORY";
const COMMUNITY_DESCRIPTON_AND_HISTORY = "COMMUNITY DESCRIPTON AND HISTORY";
const CIVIC_CLUBS = "CIVIC CLUBS";
const PARKS = "PARKS";
const BYLAWS = "BYLAWS";
const STATISTICAL_INFORMATION = "STATISTICAL INFORMATION";

const NUMBER_OF_SUPERNEIGHBORHOODS = 88;

const remove = (text = "", toBeRemoved) =>
  text.replace(toBeRemoved + ":", "").trim();

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const data = [];
  for (let index = 1; index <= NUMBER_OF_SUPERNEIGHBORHOODS; index++) {
    await page.goto(
      `https://www.houstontx.gov/superneighborhoods/${index}.html`
    );
    const textContents = await page.$$eval("p", (ps) =>
      ps.map((p) => p.textContent)
    );
    textContents.pop(); // remove last two p's
    textContents.pop(); // remove last two p's

    let name,
      dateRecognized,
      status,
      councilDistrict,
      mayorsAssistanceOffice,
      contactAndMeetingInformation,
      location,
      communityDescriptionAndHistory,
      civicClubs,
      parks,
      bylaws,
      statisticalInformation;

    for (const t of textContents) {
      if (t.includes(NAME)) {
        name = remove(t, NAME);
        console.log("Scraping", name, "-", index);
      } else if (t.includes(DATE_RECOGNIZED)) {
        dateRecognized = remove(t, DATE_RECOGNIZED);
      } else if (t.includes(STATUS)) {
        status = remove(t, STATUS);
      } else if (t.includes(COUNCIL_DISTRICT)) {
        councilDistrict = remove(t, COUNCIL_DISTRICT);
      } else if (t.includes(MAYORS_ASSISTANCE_OFFICE)) {
        mayorsAssistanceOffice = remove(t, MAYORS_ASSISTANCE_OFFICE);
      } else if (t.includes(CONTACT_AND_MEETING_INFORMATION)) {
        contactAndMeetingInformation = remove(
          t,
          CONTACT_AND_MEETING_INFORMATION
        );
      } else if (t.includes(LOCATION)) {
        location = remove(t, LOCATION);
      } else if (t.includes(Location)) {
        // sometimes lowercase
        location = remove(t, Location);
      } else if (t.includes(LOCATATION)) {
        // sometimes misspelled
        location = remove(t, LOCATATION);
      } else if (t.includes(LOCARION)) {
        // sometimes misspelled
        location = remove(t, LOCARION);
      } else if (t.includes(COMMUNITY_DESCRIPTION_AND_HISTORY)) {
        communityDescriptionAndHistory = remove(
          t,
          COMMUNITY_DESCRIPTION_AND_HISTORY
        );
      } else if (t.includes(COMMUNITY_DESCRIPTON_AND_HISTORY)) {
        // sometimes misspelled
        (communityDescriptionAndHistory = remove),
          t,
          COMMUNITY_DESCRIPTON_AND_HISTORY;
      } else if (t.includes(CIVIC_CLUBS)) {
        civicClubs = remove(t, CIVIC_CLUBS);
      } else if (t.includes(PARKS)) {
        parks = remove(t, PARKS);
      } else if (t.includes(BYLAWS)) {
        bylaws = remove(t, BYLAWS);
      } else if (t.includes(STATISTICAL_INFORMATION)) {
        statisticalInformation = remove(t, STATISTICAL_INFORMATION);
      } else {
        console.log("not found:", t);
      }
    }

    data.push({
      number: index,
      name,
      dateRecognized,
      status,
      councilDistrict,
      mayorsAssistanceOffice,
      contactAndMeetingInformation,
      location,
      communityDescriptionAndHistory,
      civicClubs,
      parks,
      bylaws,
      statisticalInformation,
    });
  }
  await browser.close();

  const json = JSON.stringify(data);
  await fs.writeFile("data.json", json, (err) => console.error(err));
})();
