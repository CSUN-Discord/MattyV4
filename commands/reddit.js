/*
This command will post a from reddit
 */

const snekfetch = require("snekfetch");
const {MessageEmbed} = require("discord.js");

const advice = [
    "AskMen",
    "howtonotgiveafuck",
    "DoesAnybodyElse",
    "askscience",
    "AskReddit",
    "lifehacks",
    "tipofmytongue",
    "AskWomen",
    "offmychest",
    "tifu",
    "relationship_advice",
    "self",
    "LifeProTips",
    "IAmA",
    "philosophy",
    "todayilearned",
    "explainlikeimfive",
    "confession",
];
const animals = [
    "NatureIsFuckingLit",
    "AnimalsBeingJerks",
    "cats",
    "AnimalsBeingBros",
    "likeus",
    "aww",
    "AnimalsBeingDerps",
    "rarepuppers",
    "dogs",
    "Awwducational",
    "HuskyTantrums"
];
const art = [
    "ArtefactPorn",
    "Graffiti",
    "reallifedoodles",
    "SketchDaily",
    "Design",
    "manga",
    "tattoos",
    "drawing",
    "Art",
    "redditgetsdrawn",
];
const diy = [
    "knitting",
    "gardening",
    "DIY",
    "Homebrewing",
    "homeautomation",
    "buildapc",
    "homestead",
    "woodworking",
    "HomeImprovement",
    "crafts",
    "lifehacks",
    "howto",
    "somethingimade",
];
const electronics = [
    "pcmasterrace",
    "iphone",
    "gadgets",
    "mac",
    "battlestations",
    "technology",
    "buildapc",
    "Android",
    "hardware",
    "raspberry_pi",
];
const entertainment = [
    "horror",
    "television",
    "podcasts",
    "Documentaries",
    "movies",
    "entertainment",
    "Music",
    "Celebs",
    "scifi",
    "boardgames",
];
const fashion = [
    "streetwear",
    "SkincareAddiction",
    "frugalmalefashion",
    "ThriftStoreHauls",
    "Sneakers",
    "femalefashionadvice",
    "AsianBeauty",
    "MakeupAddiction",
    "Watches",
    "malefashionadvice",
];
const food = [
    "EatCheapAndHealthy",
    "shittyfoodporn",
    "food",
    "slowcooking",
    "FoodPorn",
    "Cooking",
    "foodhacks",
    "GifRecipes",
    "MealPrepSunday",
    "recipes",
];
const funny = [
    "Jokes",
    "nottheonion",
    "facepalm",
    "humor",
    "dadjokes",
    "Showerthoughts",
    "ChildrenFallingOver",
    "reactiongifs",
    "ContagiousLaughter",
    "funny",
];
const gaming = [
    "wiiu",
    "GamePhysics",
    "nintendo",
    "truegaming",
    "ShouldIbuythisgame",
    "pcgaming",
    "xboxone",
    "PS4",
    "gaming",
];
const health = [
    "ADHD",
    "Health",
    "bodybuilding",
    "Fitness",
    "keto",
    "progresspics",
    "loseit",
    "GetMotivated",
    "bodyweightfitness",
    "Boxing",
];
const memes = [
    "BlackPeopleTwitter",
    "WhitePeopleTwitter",
    "me_irl",
    "wholesomememes",
    "madlads",
    "memes",
    "funny",
    "AdviceAnimals",
    "trippinthroughtime",
    "MurderedByAOC",
    "PrequelMemes",
    "PoliticalHumor",
    "tumblr",
    "HolUp",
];
const music = [
    "mashups",
    "kpop",
    "WeAreTheMusicMakers",
    "Metal",
    "electronicmusic",
    "hiphopheads",
    "classicalmusic",
    "EDM",
    "audiophile",
    "Music",
    "indieheads",
    "listentothis",
];
const news = [
    "PoliticalDiscussion",
    "worldnews",
    "UpliftingNews",
    "savedyouaclick",
    "gamernews",
    "nottheonion",
    "news",
    "subredditoftheday",
    "worldpolitics",
    "politics",
];
const outdoors = [
    "Outdoors",
    "skiing",
    "Survival",
    "MTB",
    "climbing",
    "camping",
    "hiking",
    "snowboarding",
    "CampingandHiking",
    "Fishing",
    "vandwellers",
    "homestead",
    "gardening",
];
const pics_gifs = [
    "gifs",
    "pics",
    "mildlyinfuriating",
    "photoshopbattles",
    "interestingasfuck",
    "BetterEveryLoop",
    "oddlysatisfying",
    "wheredidthesodago",
    "woahdude",
    "Cinemagraphs",
    "mildlyinteresting",
    "itookapicture",
    "wallpaper",
    "EarthPorn",
    "photocritique",
    "HistoryPorn",
    "MachinePorn",
    "ExposurePorn",
    "analog",
    "PerfectTiming",
    "Filmmakers",
    "photography",
    "astrophotography",
];

const science = [
    "compsci",
    "nasa",
    "space",
    "askscience",
    "biology",
    "Astronomy",
    "MachineLearning",
    "chemistry",
    "shittyaskscience",
    "science",
    "math",
    "Physics",
];
const sports = [
    "CFB",
    "snowboarding",
    "nfl",
    "formula1",
    "baseball",
    "nba",
    "soccer",
    "hockey",
    "tennis",
    "sports",
    "bicycling",
    "NASCAR",
    "running",
    "MMA",
    "skiing",
    "Gold",
    "CollegeBasketball",
];
const tv = [
    "thewalkingdead",
    "breakingbad",
    "NetflixBestOf",
    "gameofthrones",
    "rickandmorty",
    "television",
    "familyguy",
    "westworld",
    "southpark",
    "futurama",
];
const tech = [
    "Bitcoin",
    "gadgets",
    "pcmasterrace",
    "programming",
    "google",
    "InternetIsBeautiful",
    "javascript",
    "hacking",
    "technology",
    "learnprogramming",
    "techsupport",
    "apple",
];
const travel = [
    "urbanexploration",
    "IWantOut",
    "solotravel",
    "JapanTravel",
    "digitalnomad",
    "roadtrip",
    "travel",
    "Shoestring",
    "vagabond",
    "backpacking",
];
const video_games = [
    "leagueoflegends",
    "zelda",
    "KerbalSpaceProgram",
    "wow",
    "PUBATTLEGROUNDS",
    "Overwatch",
    "DestinyTheGame",
    "Minecraft",
    "hearthstone",
    "pokemongo",
];
const videos = [
    "youtubehaiku",
    "Whatcouldgowrong",
    "Roadcam",
    "mealtimevideos",
    "nonononoyes",
    "BestOfStreamingVideo",
    "PublicFreakout",
    "ArtisanVideos",
    "yesyesyesyesno",
    "instant_regret",
    "videos",
    "DeepIntoYouTube",
    "nononono",
];
const vroom = [
    "AutoDetailing",
    "Autos",
    "Justrolledintotheshop",
    "aviation",
    "Shitty_Car_Mods",
    "motorcycles",
    "teslamotors",
    "cars",
    "carporn",
    "MechanicAdvice",
];
const writing = [
    "writing",
    "FreeEBOOKS",
    "Fantasy",
    "books",
    "suggestmeabook",
    "Poetry",
    "Screenwriting",
    "comicbooks",
    "literature",
    "WritingPrompts",
];

module.exports = {
    name: "reddit",
    description: "Sends you an image from the subreddit or category.",
    permission: ["SEND_MESSAGES"],
    options: [
        {
            name: "subreddit",
            description: "Gets a post from a specific subreddit.",
            required: false,
            type: "SUB_COMMAND",
            options: [
                {
                    name: "subreddit",
                    description: "Name of subreddit.",
                    type: "STRING",
                    required: true,
                },
            ],
        },
        {
            name: "category",
            description: "Gets a post from a category of subreddits.",
            required: false,
            type: "SUB_COMMAND",
            options: [
                {
                    name: "category",
                    description: "Name of category.",
                    type: "STRING",
                    required: true,
                    choices: [
                        {
                            name: "advice",
                            value: "advice",
                        },
                        {
                            name: "animals",
                            value: "animals",
                        },
                        {
                            name: "art",
                            value: "art",
                        },
                        {
                            name: "diy",
                            value: "diy",
                        },
                        {
                            name: "electronics",
                            value: "electronics",
                        },
                        {
                            name: "entertainment",
                            value: "entertainment",
                        },
                        {
                            name: "fashion",
                            value: "fashion",
                        },
                        {
                            name: "food",
                            value: "food",
                        },
                        {
                            name: "funny",
                            value: "funny",
                        },
                        {
                            name: "gaming",
                            value: "gaming",
                        },
                        {
                            name: "health",
                            value: "health",
                        },
                        {
                            name: "memes",
                            value: "memes",
                        },
                        {
                            name: "music",
                            value: "music",
                        },
                        {
                            name: "news",
                            value: "news",
                        },
                        {
                            name: "outdoors",
                            value: "outdoors",
                        },
                        {
                            name: "pics_gifs",
                            value: "pics_gifs",
                        },
                        {
                            name: "science",
                            value: "science",
                        },
                        {
                            name: "sports",
                            value: "sports",
                        },
                        {
                            name: "tv",
                            value: "tv",
                        },
                        {
                            name: "tech",
                            value: "tech",
                        },
                        {
                            name: "travel",
                            value: "travel",
                        },
                        {
                            name: "video_games",
                            value: "video_games",
                        },
                        {
                            name: "videos",
                            value: "videos",
                        },
                        {
                            name: "vroom",
                            value: "vroom",
                        },
                        {
                            name: "writing",
                            value: "writing",
                        },
                    ]
                },
            ],
        },
    ],

    /**
     *
     * @param interaction
     * @returns {Promise<void>}
     */
    async execute(interaction) {
        interaction.deferReply();

        const category = interaction.options.getString("category")
        const subreddit = interaction.options.getString("subreddit")

        if (interaction.options.getSubcommand() === "subreddit") {
            await returnQuery(subreddit, interaction);
        } else if (interaction.options.getSubcommand() === "category") {

            let categorySubreddit = eval(category)[
                Math.floor(Math.random() * eval(category).length)
                ];

            await returnQuery(categorySubreddit, interaction);
        } else {
            await interaction.followUp({content: "Command not found."});
        }
    },
};


async function returnQuery (subreddit, interaction) {
    //get reddit query result
    const { body } = await snekfetch
        .get(`https://www.reddit.com/r/${subreddit}.json?sort=top&t=week`)
        .query({ limit: 800 });

    //used to see if the channel has nsfw on
    const allowed = interaction.channel.nsfw
        ? body.data.children
        : body.data.children.filter((post) => !post.data.over_18);

    //if there arent any children then there hasnt been any posts
    if (!allowed.length)
        return interaction.followUp({content: "We couldn't find any posts sorry."});

    //get a random number from the children
    const randomnumber = Math.floor(Math.random() * allowed.length);

    //if the post is an image then send it in an embed, else just post the link
    if (
        allowed[randomnumber].data.url.endsWith("jpg") ||
        allowed[randomnumber].data.url.endsWith("png")
    ) {
        const redditEmbed = new MessageEmbed()
            .setURL(
                `https://www.reddit.com/${allowed[randomnumber].data.permalink}`
            )
            .setColor("RANDOM")
            .setTitle(allowed[randomnumber].data.title)
            .setDescription("Posted by: u/" + allowed[randomnumber].data.author)
            .setImage(allowed[randomnumber].data.url)
            .addField(
                "Other info:",
                "Up votes: " +
                allowed[randomnumber].data.ups +
                " / Comments: " +
                allowed[randomnumber].data.num_comments
            )
            .setFooter(
                `Provided by ${allowed[randomnumber].data.subreddit_name_prefixed}`
            );
        return interaction.followUp({embeds: [redditEmbed]});
    }
    return interaction.followUp({content: allowed[randomnumber].data.url});
}