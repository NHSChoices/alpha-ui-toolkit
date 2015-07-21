var medicinesModel = function(data) {
    var self = this;
    ko.mapping.fromJS(data, self);
    var HTMLPLACEHOLDER = '<div style="display:none;" data-bind="template: { name: \'medicine-info-template\' }"></div>';
    self.boundElement = {};

    var loadtemplate = function() {
        var thisPath = getScriptDomainandPath('medicines-info.js');
        $.get(thisPath + "/koTemplates/medicines-dropdown.html?v=1", function(template) {
            $("body").append(template);
            loadedTemplates.push(name);
            if (list.length === loadedTemplates.length) {
                ko.applyBindings(viewModel);
            }
        });
    };

    var getTargetElement = function (event) {
        var target;

        if (event.target) target = event.target;
        else if (event.srcElement) target = event.srcElement;

        if (target.nodeType == 3) // defeat Safari bug
            target = target.parentNode;
        return target;
    };

    self.getDataAndBind = function (data, event) {
        self.getData({
            "name": "PARACETAMOL",
            "side-effects": "Side-effects side-effects rare, but rashes, blood disorders\r\n(including thrombocytopenia, leucopenia, neutropenia) reported; hypotension,\r\nflushing, and tachycardia also reported on infusion; important: liver damage (and less frequently renal damage) following overdosage, see Emergency Treatment of Poisoning",
            "pregnancy": "Pregnancy not known to be harmful",
            "fname": "/home/david/src/nhshackday/bnf-html/www.medicinescomplete.com/mc/bnf/current/3469.htm",
            "breadcrumbs": [
              "Home",
              "BNF No. 63 (March 2012)",
              "4 Central nervous system",
              "4.7 Analgesics",
              "4.7.1 Non-opioid analgesics and compound analgesic preparations"
            ],
            "cautions": "Cautions alcohol dependence; max. daily infusion dose 3 g in patients with hepatocellular\r\ninsufficiency, chronic alcoholism, chronic malnutrition,\r\nor dehydration; before administering, check when paracetamol last administered and\r\ncumulative paracetamol dose over previous 24 hours; interactions: Appendix 1 (paracetamol)",
            "doses": [
              "By mouth, 0.5–1 g every 4–6 hours to a\r\nmax. of 4 g daily; child  2 months\r\n60 mg for post-immunisation pyrexia, repeated once after 4–6 hours\r\nif necessary; otherwise under 3 months see BNF for Children; 3–6 months\r\n60 mg, 6 months–2 years 120 mg, 2–4 years 180 mg, 4–6 years 240 mg,\r\n6–8 years 240–250 mg, 8–10 years 360–375 mg, 10–12 years 480–500 mg,\r\n12–16 years 480–750 mg; these doses may be repeated every 4–6 hours\r\nwhen necessary (max. of 4 doses in 24 hours)",
              "By intravenous infusion over 15 minutes, adult and child over\r\n50 kg, 1 g every 4–6 hours, max. 4 g daily; adult and child 10–50 kg, 15 mg/kg every\r\n4–6 hours, max. 60 mg/kg daily; neonate and child less than 10 kg see BNF for Children",
              "By rectum, adult and child over 12 years 0.5–1 g every\r\n4–6 hours to a max. of 4 g daily; child under 3 months see BNF for Children, 3 months–1 year 60–125 mg, 1–5 years 125–250 mg, 5–12 years\r\n250–500 mg; these doses may be repeated every 4–6 hours as necessary\r\n(max. 4 doses in 24 hours)",
              "For full Joint Committee on Vaccination and\r\nImmunisation recommendation on post-immunisation pyrexia, see section 14.1"
            ],
            "indications": "Indications mild to moderate pain, pyrexia"
        });

        self.bindMedicineDetail(data, event);
    };

    self.closeInfo = function () {
        if (self.boundElement && self.boundElement[0]) {
            ko.cleanNode(self.boundElement[0]);
            self.boundElement.slideUp("fast", function () {
                self.boundElement.remove();
            });
        }
    };

    self.getData = function(medicineDetail) {
        ko.mapping.fromJS(medicineDetail, {}, self);
    };

    self.bindMedicineDetail = function (data, event) {
        if (self.boundElement && self.boundElement[0]) {
            var oldElemnt = self.boundElement;
            ko.cleanNode(oldElemnt[0]);
            oldElemnt.slideUp("fast", function () {
                oldElemnt.remove();
            });
        }
        var target = getTargetElement(event);

        var insertedElement = $(HTMLPLACEHOLDER).insertAfter($(target));
        self.boundElement = insertedElement;
        ko.applyBindings(self, insertedElement[0]);
        insertedElement.slideDown();
    }
};





function getScriptDomainandPath(scriptFileName) {
    var jsscript = document.getElementsByTagName("script");
    for (var i = 0; i < jsscript.length; i++) {
        var pattern = RegExp("\\b" + scriptFileName + "\\b", "g");
        if (pattern.test(jsscript[i].getAttribute("src")))
            return jsscript[i].getAttribute("src").replace(scriptFileName, "");
    }

    return '';
}
