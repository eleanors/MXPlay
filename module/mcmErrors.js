define(function (require, exports, module) {
    exports.mcmTip = function (data) {
        var errors = {
                100: i18n.t("mcm.Error100"),
                101: i18n.t("mcm.Error101"),
                102: i18n.t("mcm.Error102"),
                103: i18n.t("mcm.Error103"),
                104: i18n.t("mcm.Error104"),
                105: i18n.t("mcm.Error105"),
                106: i18n.t("mcm.Error106"),
                107: i18n.t("mcm.Error107"),
                108: i18n.t("mcm.Error108"),
                109: i18n.t("mcm.Error109"),
                110: i18n.t("mcm.Error110"),
                111: i18n.t("mcm.Error111"),
                112: i18n.t("mcm.Error112"),
                113: i18n.t("mcm.Error113"),
                114: i18n.t("mcm.Error114"),
                115: i18n.t("mcm.Error115"),
                116: i18n.t("mcm.Error116"),
                117: i18n.t("mcm.Error117"),
                118: i18n.t("mcm.Error118"),
                119: i18n.t("mcm.Error119"),
                120: i18n.t("mcm.Error120"),
                121: i18n.t("mcm.Error121"),
                122: i18n.t("mcm.Error122"),
                123: i18n.t("mcm.Error123"),
                124: i18n.t("mcm.Error124"),
                125: i18n.t("mcm.Error125")
            },
            restErrors = {
                201: i18n.t("global.CannotBeEmpty"),
                202: i18n.t("mcm.UsernameAlreadyExists")
            };
        if (data.error && data.error.status) {
            return restErrors[data.error.status];
        } else {
            return errors[data.code];
        }
    };
});
