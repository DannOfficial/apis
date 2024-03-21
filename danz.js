const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");

const clean = e => (e = e.replace(/(<br?\s?\/>)/gi, " \n")).replace(/(<([^>] )>)/gi, "");

async function shortener(e) {
  return e;
}

async function tiktok(url) {
  return new Promise(async (resolve, reject) => {
    try {
      let t = await axios("https://lovetik.com/api/ajax/search", { method: "post", data: new URLSearchParams(Object.entries({ query: url })) });

      const result = {};
      result.title = clean(t.data.desc);
      result.author = clean(t.data.author);
      result.nowm = await shortener((t.data.links[0].a || "").replace("https", "http"));
      result.watermark = await shortener((t.data.links[1].a || "").replace("https", "http"));
      result.audio = await shortener((t.data.links[2].a || "").replace("https", "http"));
      result.thumbnail = await shortener(t.data.cover);

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

async function igdl(url) {
            let res = await axios("https://indown.io/");
            let _$ = cheerio.load(res.data);
            let referer = _$("input[name=referer]").val();
            let locale = _$("input[name=locale]").val();
            let _token = _$("input[name=_token]").val();
            let { data } = await axios.post(
              "https://indown.io/download",
              new URLSearchParams({
                link: url,
                referer,
                locale,
                _token,
              }),
              {
                headers: {
                  cookie: res.headers["set-cookie"].join("; "),
                },
              }
            );
            let $ = cheerio.load(data);
            let result = [];
            let __$ = cheerio.load($("#result").html());
            __$("video").each(function () {
              let $$ = $(this);
              result.push({
                type: "video",
                thumbnail: $$.attr("poster"),
                url: $$.find("source").attr("src"),
              });
            });
            __$("img").each(function () {
              let $$ = $(this);
              result.push({
                type: "image",
                url: $$.attr("src"),
              });
            });

            return result;
}

async function capcut(url) {
    try {
        const response = await axios.post("https://api.teknogram.id/v1/capcut", { url });
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function tiktoks(query) {
  try {
    const response = await axios({
      method: 'POST',
      url: 'https://tikwm.com/api/feed/search',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': 'current_language=en',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
      },
      data: {
        keywords: query,
        count: 10,
        cursor: 0,
        HD: 1
      }
    });

    const videos = response.data.data.videos;
    if (videos.length === 0) {
      throw new Error("Tidak ada video ditemukan.");
    } else {
      const gywee = Math.floor(Math.random() * videos.length);
      const videorndm = videos[gywee]; 

      const result = {
        title: videorndm.title,
        cover: videorndm.cover,
        origin_cover: videorndm.origin_cover,
        no_watermark: videorndm.play,
        watermark: videorndm.wmplay,
        music: videorndm.music
      };
      return result;
    }
  } catch (error) {
    throw error;
  }
}

async function aiodl(url) {
  try {
    const response = await axios.post("https://aiovd.com/wp-json/aio-dl/video-data", {
      url: url
    }, 
    {
      headers: {
        'Accept': '/',
        'Content-Type': 'application/json'
      }
    });

    const res = response.data;
    const result = {
      data: res.medias
    };

    return result;
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  tiktok,
  igdl,
  capcut,
  tiktoks,
  aiodl
}