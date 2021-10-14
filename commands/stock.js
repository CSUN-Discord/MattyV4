/*
This command will return an embed for stock and crypto prices
*/

const yahooFinance = require('yahoo-finance');
const price = require('crypto-price');
const {MessageEmbed} = require("discord.js");

module.exports = {
    name: "stocks",
    description: "Crypto or stock prices at your fingertips.",
    options: [
        {
            name: "type",
            description: "Stocks or Crypto?",
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "stock",
                    value: "stock"
                },
                {
                    name: "crypto",
                    value: "crypto"
                }
            ]
        },
        {
            name: "name",
            description: "Name of crypto or stock to look up.",
            type: "STRING",
            required: true
        }
    ],
    permission: ["SEND_MESSAGES"],

    /**
     *
     * @param interaction
     * @returns {Promise<void>}
     */
    async execute(interaction) {
        interaction.deferReply();

        const type = interaction.options.getString("type");
        const name = interaction.options.getString("name").toUpperCase();


            if (type === "stock") {
                try {
                    yahooFinance.quote({
                        symbol: name,
                        modules: [ 'price', 'summaryDetail' ]
                    }, function (err, quotes) {
                        if (err) {
                            interaction.followUp({content: "Couldn't find stock."})
                        }
                        else {
                            let title = `${quotes.price.symbol} - `;
                            if (quotes.price.longName !== null)
                                title += quotes.price.longName;
                            const stockEmbed = new MessageEmbed()
                                .setTitle(title)
                                .setColor("#ff4242")
                                .setURL(`https://finance.yahoo.com/quote/${name}`)
                                .addFields(
                                    {
                                        name: `Regular Market Price (${quotes.price.currency})`,
                                        value: `${quotes.price.currencySymbol} ${quotes.price.regularMarketPrice}`,
                                        inline: true,
                                    },
                                    {
                                        name: "Day Low",
                                        value: `${quotes.price.currencySymbol} ${quotes.price.regularMarketDayLow}`,
                                        inline: true,
                                    },
                                    {
                                        name: "Day High",
                                        value: `${quotes.price.currencySymbol} ${quotes.price.regularMarketDayHigh}`,
                                        inline: true,
                                    },
                                    {
                                        name: "Regular Market Change",
                                        value: `${quotes.price.currencySymbol} ${quotes.price.regularMarketChange}`,
                                        inline: true,
                                    },
                                    {
                                        name: "Regular Market Change Percentage",
                                        value: `${
                                            quotes.price.regularMarketChangePercent * 100
                                        }%`,
                                        inline: true,
                                    },
                                    {
                                        name: "Regular Market Open",
                                        value: `${quotes.price.currencySymbol} ${quotes.price.regularMarketOpen}`,
                                        inline: true,
                                    },
                                    {
                                        name: "Regular Market Previous Close",
                                        value: `${quotes.price.currencySymbol} ${quotes.price.regularMarketPreviousClose}`,
                                        inline: true,
                                    }
                                )
                                .setTimestamp()
                                .setFooter(quotes.price.quoteSourceName);
                            if (quotes.summaryDetail.dividendYield == null)
                                stockEmbed.addField("Dividend Yield", `N/A`, true);
                            else
                                stockEmbed.addField(
                                    "Dividend Yield",
                                    `${quotes.summaryDetail.dividendYield}`,
                                    true
                                );
                            if (quotes.summaryDetail.dividendYield == null)
                                stockEmbed.addField("Dividend Rate", `N/A`, true);
                            else
                                stockEmbed.addField(
                                    "Dividend Rate",
                                    `${quotes.summaryDetail.dividendRate}`,
                                    true
                                );
                            if (quotes.summaryDetail.dividendYield == null)
                                stockEmbed.addField("Ex-Divident Date", `N/A`, true);
                            else
                                stockEmbed.addField(
                                    "Ex-Divident Date",
                                    `${quotes.summaryDetail.exDividendDate}`,
                                    true
                                );
                            return interaction.followUp({embeds: [stockEmbed]});
                        }
                    });
                }catch (e) {
                    await interaction.followUp({content: "Couldn't find stock."})
                }
            }
            else if (type === "crypto") {
                price.getCryptoPrice("USD", name).then(obj  => {
                    if (obj  == null) {
                        interaction.followUp({content: "Couldn't find crypto."})
                    }
                    else{
                        const stockEmbed = new MessageEmbed()
                            .setTitle(`${obj.base}`)
                            .setColor("#ff4242")
                            .addFields(
                                {
                                    name: `Volume Weighted Price (${obj.target})`,
                                    value: `$${obj.price}`,
                                },
                                {
                                    name: "Total Trade Volume for the Last 24 Hours",
                                    value: `${obj.volume}`,
                                },
                                {
                                    name: "Past Hour Price Change",
                                    value: `$${obj.change}`,
                                });
                        return interaction.followUp({embeds: [stockEmbed]});
                    }
                }).catch(err => {
                    console.log(err)
                    interaction.followUp({content: "Couldn't find crypto."})
                })
            } else {
                await interaction.followUp({content: "Wrong command."})
            }
    },
};
