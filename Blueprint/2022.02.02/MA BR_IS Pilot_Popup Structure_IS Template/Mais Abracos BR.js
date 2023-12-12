(function() {

    const pageExitMillis = 5;
    // $("#maisabracos_br_email").on("input", validate);

    /**
     * @function buildBindId
     * @param {Object} context
     * @description Create unique bind ID based on the campaign and experience IDs.
     */
    function buildBindId(context) {
        return `${context.campaign}:${context.experience}`;
    }

    function apply(context, template) {
        var count = 0;
        Evergage.DisplayUtils.pageInactive(1).subscribe(function(event) {
            if (count >= 1) {
                return event.disconnect();
            }else {
                setCookiesFromURLParameters();
                onlyForKnownUserTesting(); // only for known user testing

                const html = template(context);
                const Bdob = getCookie("_evga_Bdob");
                const mail = getCookie("_evga_email");
                const customerName = getCookie("_evga_name");

                if (Bdob == ""){
                    Evergage.cashDom("body").append(html);
                    const its_for_Known_User = Evergage.cashDom("#its_for_Known_User").val();
                    const have_Form = Evergage.cashDom("#have_Form").val();

                    if (mail == "" && Bdob == "" && customerName == ""){ // Unknown user - null all values
                        setConfirmationPanel();
                        setDismissal();
                        validationFieldsRequire();
                        includeChangeValueFunction();
                    }
                    else{ // Known user without baby birth date     //plus from email (Known user without baby birth date)
                        if (mail != ""){
                            if (its_for_Known_User=="true" && customerName != ""){
                                document.getElementById("customerName").innerHTML = customerName;
                                document.getElementById("customerNameConfirmation").innerHTML = customerName;
                            }else{
                                Evergage.cashDom("#section_name").addClass("evg-hide");
                                Evergage.cashDom("#section_name_confirmation").addClass("evg-hide");
                            }

                            if (have_Form=="true"){
                                document.getElementById("dwfrm_profile_customer_email").value = mail;
                                Evergage.cashDom("#section_email").addClass("evg-hide");
                            }

                            setConfirmationPanel();
                            setDismissal();
                            validationFieldsRequire();
                            includeChangeValueFunction();
                        }
                    }

                    var event = document.createEvent('Event');
                    event.initEvent('evergage:popupopen', true, true);
                    document.body.dispatchEvent(event);
                                        
                    const campaignExperience = Evergage.cashDom("#trackName").val();
                    const url = window.location.href;
                    const trackID = Evergage.cashDom("#trackID").val();
                    
                    Evergage.sendEvent( { 
                        action: campaignExperience +" - "+ deviceType() + " - Open"
                    } );
                    pushDataLayer('popupopen', campaignExperience, url, trackID, null, null, null);
                }
            }
            console.log("inactive for 1 milisecond");
            count++;
        });
        /**
         * The pageExit method waits for the user's cursor to exit through the top edge of the page before rendering the
         * template after a set delay.
         *
         * Visit the Template Display Utilities documentation to learn more:
         * https://developer.evergage.com/campaign-development/web-templates/web-display-utilities
         */

        if (!context.contentZone) return;
        console.log("Element is loaded | then");
    }

    function reset(context, template) {
        Evergage.DisplayUtils.unbind(buildBindId(context));
        Evergage.cashDom("#evg-exit-intent-popup-email-capture").remove();
    }

    function control(context) {
        const contentZoneSelector = Evergage.getContentZoneSelector(context.contentZone);
        return Evergage.DisplayUtils
            .bind(buildBindId(context))
            .pageElementLoaded(contentZoneSelector)
            .pageExit(pageExitMillis)
            .then((element) => {
                Evergage.cashDom(element).attr({
                    "data-evg-campaign-id": context.campaign,
                    "data-evg-experience-id": context.experience,
                    "data-evg-user-group": context.userGroup
                });
            });
    }

    registerTemplate({
        apply: apply,
        reset: reset,
        control: control
    });

    function includeChangeValueFunction() {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.text = "function changeValue(field){ const eventCat = Evergage.cashDom('#trackName').val(); const eventLab = window.location.href; const trackID = Evergage.cashDom('#trackID').val(); let userType = ''; if(eventCat.includes('Unknown')){ userType = 'Unknown'; }else{ if(eventCat.includes(' Known')){ userType = 'Known'; } } var fieldName = field.name; window.dataLayer.push({ event: 'formchange', category: eventCat, action: 'formchange', label: eventLab, trackid: trackID, formfield: fieldName, usertype: userType }); }";
        head.appendChild(script);
    }

    /**
     * @function setConfirmationPanel
     * @description Add click listener to the Call-To-Action button that validates the user email address,
     * shows the Confirmation Panel, removes dismissal tracking from the "X" button and overlay, and sends
     * an event to Interaction Studio to set the emailAddress attribute to the user email address.
     */
    function setConfirmationPanel() {
        const campaignExperience = Evergage.cashDom("#trackName").val();
        const url = window.location.href;
        const trackID = Evergage.cashDom("#trackID").val();
        const have_Form = Evergage.cashDom("#have_Form").val();
        const have_Thank_You_page = Evergage.cashDom("#have_Thank_You_page").val();
        
        Evergage.cashDom("#maisabracos-form .evg-cta").on("click", () => {
            const email = Evergage.cashDom("#dwfrm_profile_customer_email").val();
            let accept_terms="";
            let add_to_email_list="";

            var existCheck1 = document.getElementById("accept-terms");
            var existCheck2 = document.getElementById("add-to-email-list");

            if(existCheck1 != "" && existCheck1 != null) accept_terms = document.getElementById("accept-terms").checked;
            if(existCheck2 != "" && existCheck1 != null) add_to_email_list = document.getElementById("add-to-email-list").checked;
            
            let str = Evergage.cashDom("#dwfrm_profile_customer_additionalFields_childDOB").val();
            let d = str.substring(0, 2);
            let m = str.substring(3, 5);
            let y = str.substring(6, 10);
            let s = '-';
            let f = 'T00:00:00'; 
            const dob = y.concat(s, m, s, d, f);

            if (email == "" || email == null  ||  str == "" || str == null) {
                Evergage.cashDom("#evg-exit-intent-popup-email-capture .invalid-feedback")
                    .removeClass("evg-hide")
                    .addClass("evg-error-msg");
            }else{
                Evergage.cashDom("#evg-exit-intent-popup-email-capture .evg-main-panel").addClass("evg-hide");
                Evergage.cashDom("#ctaFixed").addClass("evg-hide");
                Evergage.cashDom("#tabform").addClass("evg-hide");

                if (have_Thank_You_page){
                    Evergage.cashDom("#evg-exit-intent-popup-email-capture .evg-confirm-panel").removeClass("evg-hide");
                    Evergage.cashDom(`
                        #evg-exit-intent-popup-email-capture .evg-overlay,
                        #evg-exit-intent-popup-email-capture .evg-btn-dismissal
                    `).removeAttr("data-evg-dismissal");

                    pushDataLayer('formsubmit', campaignExperience, url, trackID, null, null, 'submission_success');

                }else{
                    Evergage.cashDom("#evg-exit-intent-popup-email-capture .evg-popup").addClass("evg-hide");
                    Evergage.cashDom(`
                        #evg-exit-intent-popup-email-capture .evg-overlay,
                        #evg-exit-intent-popup-email-capture .evg-btn-dismissal
                    `).addClass("evg-hide");
                }

                setCookie("_evga_email", email, "/", 730);
                setCookie("_evga_Bdob",    str, "/", 730);

                Evergage.sendEvent(
                {
                    action: campaignExperience +" - "+ deviceType() + " - CTA Click" , 
                    user: {
                        attributes: {
                            id: email,
                            emailAddress:  email, 
                            babyBirthDay: dob,
                            acceptTerms : accept_terms,
                            acceptEmails : add_to_email_list
                            }
                        }
                    }
                );

                const ctaText = Evergage.cashDom("#ctaText").val();
                pushDataLayer('clickEvent', campaignExperience, url, trackID, null, ctaText, null);

            }
        });

        Evergage.cashDom("#maisabracos-form .evg-confirm-cta").on("click", () => {
            // console.log("evg-confirm-cta have_Form="+ have_Form +", have_Thank_You_page="+ have_Thank_You_page);

            const ctaExitUrl = Evergage.cashDom("#ctaExitUrl").val();
            const ctaExitText = Evergage.cashDom("#ctaExitText").val();
            const confirmationCTAText = Evergage.cashDom("#confirmationCTAText").val();
            let accept_terms="";
            let add_to_email_list="";

            var existCheck1 = document.getElementById("accept-terms");
            var existCheck2 = document.getElementById("add-to-email-list");

            if(existCheck1 != "" && existCheck1 != null) accept_terms = document.getElementById("accept-terms").checked;
            if(existCheck2 != "" && existCheck1 != null) add_to_email_list = document.getElementById("add-to-email-list").checked;

            if(have_Form=="true"){
                const email = Evergage.cashDom("#dwfrm_profile_customer_email").val();
            
                let str = Evergage.cashDom("#dwfrm_profile_customer_additionalFields_childDOB").val();
                let d = str.substring(0, 2);
                let m = str.substring(3, 5);
                let y = str.substring(6, 10);
                let s = '-';
                let f = 'T00:00:00'; 
                const dob = y.concat(s, m, s, d, f);

                if (email == "" || email == null  ||  str == "" || str == null) {
                    Evergage.cashDom("#evg-exit-intent-popup-email-capture .invalid-feedback")
                        .removeClass("evg-hide")
                        .addClass("evg-error-msg");
                }else{
                    Evergage.cashDom("#evg-exit-intent-popup-email-capture .evg-main-panel").addClass("evg-hide");
                    Evergage.cashDom("#ctaFixed").addClass("evg-hide");
                    Evergage.cashDom("#tabform").addClass("evg-hide");
                
                    if (have_Thank_You_page=="true"){
                        Evergage.cashDom("#evg-exit-intent-popup-email-capture .evg-confirm-panel").removeClass("evg-hide");
                        Evergage.cashDom(`
                            #evg-exit-intent-popup-email-capture .evg-overlay,
                            #evg-exit-intent-popup-email-capture .evg-btn-dismissal
                        `).removeAttr("data-evg-dismissal");

                        pushDataLayer('formsubmit', campaignExperience, url, trackID, null, null, 'submission_success');

                    }else{
                        Evergage.cashDom("#evg-exit-intent-popup-email-capture .evg-popup").addClass("evg-hide");
                        Evergage.cashDom(`
                            #evg-exit-intent-popup-email-capture .evg-overlay,
                            #evg-exit-intent-popup-email-capture .evg-btn-dismissal
                        `).addClass("evg-hide");
                    }

                    setCookie("_evga_email", email, "/", 730);
                    setCookie("_evga_Bdob",    str, "/", 730);

                    window.location.href = ctaExitUrl;

                    Evergage.sendEvent(
                    { 
                        action: campaignExperience +" - "+ deviceType() + " - CTA Click", 
                        user: {
                            attributes: {
                                id: email,
                                emailAddress:  email, 
                                babyBirthDay: dob,
                                acceptTerms : accept_terms,
                                acceptEmails : add_to_email_list
                                }
                            }
                        }
                    );

                    pushDataLayer('clickEvent', campaignExperience, url, trackID, null, ctaExitText, null);
                }
                
            }else{
                Evergage.cashDom("#evg-exit-intent-popup-email-capture .evg-main-panel").addClass("evg-hide");
                Evergage.cashDom("#ctaFixed").addClass("evg-hide");
                Evergage.cashDom("#tabform").addClass("evg-hide");

                if (have_Thank_You_page=="true"){
                    Evergage.cashDom("#evg-exit-intent-popup-email-capture .evg-confirm-panel").removeClass("evg-hide");
                    Evergage.cashDom(`
                        #evg-exit-intent-popup-email-capture .evg-overlay,
                        #evg-exit-intent-popup-email-capture .evg-btn-dismissal
                    `).removeAttr("data-evg-dismissal");

                    Evergage.sendEvent({ action: campaignExperience +" - "+ deviceType() + " - CTA Click" } );
                    pushDataLayer('formsubmit', campaignExperience, url, trackID, null, null, 'submission_success');

                }else{
                    Evergage.cashDom("#evg-exit-intent-popup-email-capture .evg-popup").addClass("evg-hide");
                    Evergage.cashDom(`
                        #evg-exit-intent-popup-email-capture .evg-overlay,
                        #evg-exit-intent-popup-email-capture .evg-btn-dismissal
                    `).addClass("evg-hide");

                    window.location.href = ctaExitUrl;

                    Evergage.sendEvent({ action: campaignExperience +" - "+ deviceType() + " - CTA Click" } );
                    pushDataLayer('clickEvent', campaignExperience, url, trackID, null, ctaExitText, null);
                }

            }

        });
    }

    /**
     * @function setDismissal
     * @param {Object} context
     * @description Add click listener to the overlay, "X" button, and opt-out text that removes the
     * template from the DOM.
     */
    function setDismissal() {
        const dismissSelectors = `
            #evg-exit-intent-popup-email-capture .evg-overlay,
            #evg-exit-intent-popup-email-capture .evg-btn-dismissal,
            #evg-exit-intent-popup-email-capture .evg-opt-out-msg
        `;
        const campaignExperience = Evergage.cashDom("#trackName").val();
        const url = window.location.href;
        const trackID = Evergage.cashDom("#trackID").val();
        let payload = campaignExperience +" - "+ deviceType() + " - Close";

        Evergage.cashDom(dismissSelectors).on("click", () => {
            Evergage.cashDom("#evg-exit-intent-popup-email-capture").remove();

            Evergage.sendEvent( { 
                action: payload
            } );

            pushDataLayer('popupclose', campaignExperience, url, trackID, null, null, null);

        });
    }


    /**
     * @function customs
     */
    function validationFieldsRequire() {
        Evergage.cashDom("#accept-terms").on("click", () => {
            var checkBox = Evergage.cashDom("#accept-terms");
            var email = Evergage.cashDom("#dwfrm_profile_customer_email").val();
            var dob = Evergage.cashDom("#dwfrm_profile_customer_additionalFields_childDOB").val();

            if (validateEmail(email) && dob!="" && checkBox.prop("checked") == true){
                Evergage.cashDom("#maisabracos-form .evg-cta").removeAttr("disabled");
                Evergage.cashDom("#maisabracos-form .evg-confirm-cta").removeAttr("disabled");
            } else {
                Evergage.cashDom("#maisabracos-form .evg-cta").prop("disabled", true);
                Evergage.cashDom("#maisabracos-form .evg-confirm-cta").prop("disabled", true);
            }
        });
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    /**
     * @function setCookie
     * @param {Object} context
     * @description Set Evergage cookies with email, and the baby's date of birth
     */
    function setCookie(cookieName,cookieValue, cookiePath, expirationDays) {
        const dat = new Date();
        dat.setTime(dat.getTime() + (expirationDays*24*60*60*1000));
        let expires = "expires=" + dat.toGMTString();
        let path = "path=" + cookiePath;

        document.cookie = cookieName + "=" + cookieValue + ";" + path + ";" + expires;
    }

    function setCookiesFromURLParameters(){
        var p = window.location.search;
        var firstName = '';
        var email = '';
        var emailSource = '';
        if( p.startsWith("?") ){
            p = p.replace("?", "");
            p = p.replace("%40", "@");
            
            // get parameters values
            // fn = FirstName, em=Email
            while(p.length>0){
                var eq = p.indexOf("=");
                var amp = p.indexOf("&");

                var param = p.substr(0, eq);
                if(amp>0){
                    var val = p.substr(eq+1, amp-eq-1);
                    p = p.substr(amp+1, p.lenght);
                }else{
                    var val = p.substr(eq+1, p.length);
                    p = "";
                }
                
                // set cookies values on browser
                // fn = FirstName, em=Email, eso=EmailSource
                // alert("lenght="+ p.length +", eq= "+ eq + ", amp="+ amp +", param= "+ param + ", val="+ val);
                if(param=="em"){
                    setCookie("_evga_email", val, "/", 730);
                    email = val;
                }
                if(param=="fn"){
                    setCookie("_evga_name", val, "/", 730);
                    firstName = val;
                }
                if(param=="eso"){
                    emailSource = val;
                }
            }

            Evergage.sendEvent({
                action: "Known user from email popup response "+ emailSource, 
                user: {
                    attributes: {
                        id: email,
                        emailAddress:  email,
                        customerId: email, 
                        name: firstName
                        }
                    }
                });
        }
    }


    function onlyForKnownUserTesting(){
        var u = window.location.href;
        if( u.endsWith("#known") ){
            const Bdob = getCookie("_evga_Bdob");
            const mail = getCookie("_evga_email");
            const customerName = getCookie("_evga_name");

            if(Bdob!='' && mail!=''){
                setCookie("_evga_Bdob",    null, "/", -730);
            }
            if(customerName == ''){
                setCookie("_evga_name",    "Known User", "/", 730);
            }
        }
    }

    /**
     * @function getCookie
     * @param {Object} context
     * @description Get Evergage cookies and identify puid, email, and the baby's date of birth
     */
    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    /**
     * @function deviceType
     * @param {Object} context
     * @description Gets the device type and categorizes them by types
     */
    function deviceType(){
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return "Tablet";
        }
        else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return "Mobile";
        }
        return "Desktop";
    }

    function pushDataLayer(event, eventCat, eventLab, trackID, formField, ctaButtonName, evenAction){

        let userType = "";
        if(eventCat.includes("Unknown")){
            userType = 'Unknown';
        }else{
            if(eventCat.includes(" Known")){
                userType = 'Known';
            }
        }

        if(formField!='' && formField!=null){
            window.dataLayer.push({
                event: event, category: eventCat, action: event, 
                label: eventLab, trackid: trackID,
                formfield: formField, usertype: userType
            });
        }else{
            if(ctaButtonName!='' && ctaButtonName!=null){
                window.dataLayer.push({
                    event: event, category: eventCat, action: event, 
                    label: eventLab, trackid: trackID,
                    'CTA text': ctaButtonName, usertype: userType
                });
            }else{
                if(evenAction!='' && evenAction!=null){
                    window.dataLayer.push({
                        event: event, category: eventCat, action: evenAction, 
                        label: eventLab, trackid: trackID,
                        usertype: userType
                    });
                }else{
                    window.dataLayer.push({
                        event: event, category: eventCat, action: event, 
                        label: eventLab, trackid: trackID,
                        usertype: userType
                    });
                }
            }
        }
    }

})();
