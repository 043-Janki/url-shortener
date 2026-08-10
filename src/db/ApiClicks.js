import { UAParser } from "ua-parser-js";
import supabase from "./supabase";

export async function getClicksForUrls(urlIds) {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", urlIds);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to load Clicks");
  }

  return data;
}

const parser = new UAParser();

// export const storeClicks = async ({ id, originalUrl }) => {
//   try {
//     const res = parser.getResult();
//     const device = res.type || "desktop";

//     const response = await fetch("https://ipapi.co/json");
//     const { city, country_name: country } = await response.json();

//     await supabase.from("clicks").insert({
//       url_id: id,
//       city: city,
//       country: country,
//       device: device,
//     });

//     window.location.href = originalUrl;
//   } catch (error) {
//     console.error("Error recording click:", error);
//   }
// };

export const storeClicks = async ({ id, originalUrl }) => {
  try {
    const res = parser.getResult();
    const device = res.type || "desktop";

    let city = "Unknown";
    let country = "Unknown";

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      );

      const locationData = await response.json();

      city =
        locationData.address.city ||
        locationData.address.town ||
        locationData.address.village ||
        "Unknown";

      country = locationData.address.country || "Unknown";
    } catch (locationError) {
      console.log("GPS location unavailable, falling back to IP location.");

      const response = await fetch("https://ipapi.co/json");
      const data = await response.json();

      city = data.city || "Unknown";
      country = data.country_name || "Unknown";
    }

    console.log(city, country);

    await supabase.from("clicks").insert({
      url_id: id,
      city,
      country,
      device,
    });

    window.location.href = originalUrl;
  } catch (error) {
    console.error("Error recording click:", error);
  }
};

export async function getClicksForUrl({ url_id }) {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .eq("url_id", url_id);

  if (error) {
    console.error(error);
    throw new Error("Unable to load Stats");
  }

  return data;
}
