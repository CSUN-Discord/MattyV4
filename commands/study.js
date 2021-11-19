/*
gives people the study role and takes off verified/student
*/

const studyFunctions = require("../db/functions/studyFunctions");

module.exports = {
    name: "study",
    description: "Gives the user study role and removes student/verified.",
    permission: ["ADMINISTRATOR"],
    options: [
        {
            name: "user",
            description: "User to give role to.",
            required: true,
            type: "USER"
        }
    ],

    /**
     *
     * @param interaction
     * @returns {Promise<void>}
     */
    async execute(interaction) {

        const user = interaction.options.getUser("user");
        let member = interaction.guild.members.cache.get(user.id);

        const study = interaction.guild.roles.cache.find(
            (r) => r.name.toLowerCase() === "study"
        ) || null;
        const student = interaction.guild.roles.cache.find(
            (r) => r.name.toLowerCase() === "student"
        ) || null;
        const verified = interaction.guild.roles.cache.find(
            (r) => r.name.toLowerCase() === "verified"
        ) || null;

        if (study == null || student == null || verified == null)
            return interaction.reply({content: "Couldn't find roles.", ephemeral: true});

        if (
            member.roles.cache.some((role) => role.id === verified.id)
        ) {
            await studyFunctions.addVerifiedUser(user.id);
            member.roles.remove(verified);
        }
        if (
            member.roles.cache.some((role) => role.id === student.id)
        ) {
            member.roles.remove(student);
        }
        if (
            member.roles.cache.some((role) => role.id === study.id)
        ) {
            member.roles.remove(study);
            member.roles.add(student);

            const document = await studyFunctions.removeVerifiedUser(user.id);

            if (document) {
                member.roles.add(verified);
            }

        } else {
            member.roles.add(study);
        }
        return interaction.reply({content: "User updated.", ephemeral: true});
    },

};