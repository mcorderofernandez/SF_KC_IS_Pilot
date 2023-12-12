export class StyleField {
    label: string;
    className: string;
}

export class ValuesField {
    label: string;
    value: string;
}

export class ExitIntentPopupWithEmailCapture implements CampaignTemplateComponent {

@header("General")

    @title("Track Name")
    @subtitle("Page - Experience")
    trackName: string = "Produts - Desconto";

    @title("Logo URL MaisAbracos")
    imageMaisAbracosUrl: string = "https://www.maisabracos.com.br/dw/image/v2/BFDX_PRD/on/demandware.static/-/Sites-MaisAbracos_BR-Library/default/dw8eb9bfff/images/homepage/logo-white.png";

    @title("Mobile Image URL")
    imageMobileUrl: string = "https://staging-na01-kimberlyclark.demandware.net/on/demandware.static/-/Sites-MaisAbracos_BR-Library/default/dwa6a8b00b/images/articles/bebe-prestes-a-pronunciar-as-primeiras-silabas.jpg";

    @title("Desktop Left Image URL")
    imageDesktopUrl: string = "https://www.maisabracos.com.br/dw/image/v2/BFDX_PRD/on/demandware.static/-/Sites-MaisAbracos_BR-Library/default/dw069b1fcc/images/homepage/masabrazos/slider-right-image.png";

    header: string = "Title Text";

    @subtitle("Optional text field")
    subheader: string = "Subtitle Text";

its_for_Known_User: boolean = true;

    @shownIf(this, self => self.its_for_Known_User === true)
    @title("Username introduction")
    @subtitle("Message before the Username. Only apply to known users.")
    startUsername: string = "Ol?, ";

    @shownIf(this, self => self.its_for_Known_User === true)
    @title("Username conclusion")
    @subtitle("Message after the Username. Only apply to known users.")
    endUsername: string = "!";

have_Form: boolean = true;

    @shownIf(this, self => self.have_Form === true)
    @title("Form header message")
    formHeader: string = "Form header message";

    @shownIf(this, self => self.have_Form === true)
    @title("Email label")
    labelEmail: string = "E-mail";

    @shownIf(this, self => self.have_Form === true)
    @title("Email validation message")
    validationEmailMessage: string = "Por favor, ingresse um E-mail v?lido";

    @shownIf(this, self => self.have_Form === true)
    @title("Calendar label")
    labelCalendar: string = "Data de nascimento do beb?";

    @shownIf(this, self => self.have_Form === true)
    @title("Calendar language")
    @options([
        { label: "English", value: "en" },
        { label: "Portuguese", value: "pt" }
    ])
    lang: ValuesField = { label: "Portuguese", value: "pt" };

    @shownIf(this, self => self.have_Form === true)
    @title("Required fields")
    fieldRequiredMessage: string = "Este campo ? obrigat?rio";

    @title("Login URL")
    loginUrl: string = "https://staging-na01-kimberlyclark.demandware.net/s/MaisAbracos_BR/iniciarsessao";
    
    @title("Login start message")
    loginTextStart: string = "J? ? registrado? ";

    @title("Login link message")
    loginText: string = "Fa?a seu login aqui";

/* Accept terms */

    @shownIf(this, self => self.have_Form === true)
    @title("Accept terms Check-1 start message")
    checkText1Start: string = "Aceito os ";

    @shownIf(this, self => self.have_Form === true)
    @title("Check-1 end message")
    checkText1End: string = " do site. Concordo em fornecer meus dados para receber informa??es personalizadas.";

    @shownIf(this, self => self.have_Form === true)
    @title("Terms Text")
    termsText: string = "Termos e Condi??es";

    @shownIf(this, self => self.have_Form === true)
    @title("Terms URL")
    termsLink: string = "https://staging-na01-kimberlyclark.demandware.net/s/MaisAbracos_BR/servico-ao-cliente/termos-legais.html";

    @shownIf(this, self => self.have_Form === true)
    @title("Privacy Text")
    privacyText: string = "Pol?tica de Privacidade";

    @shownIf(this, self => self.have_Form === true)
    @title("Privacy URL")
    privacyLink: string = "https://www.kimberly-clark.com/pt-br/privacy";

    @shownIf(this, self => self.have_Form === true)
    @title("Check-2 message")
    checkText2: string = "Sim, aceito receber e-mails sobre ofertas, lan?amento?de produtos e artigos de Mais Abra?os e de outras marcas da Kimberly-Clark.";

have_Thank_You_page: boolean = true;

/* CTA  */
    @shownIf(this, self => self.have_Thank_You_page === true)
    @title("CTA Text")
    ctaText: string = "Registro";

/* CTA Exit */

    @shownIf(this, self => self.have_Thank_You_page === false)
    @title("CTA Text")
    ctaExitText: string = "CTA Exit Text";

    @shownIf(this, self => self.have_Thank_You_page === false)
    @title("CTA URL")
    ctaExitUrl: string = "https://staging-na01-kimberlyclark.demandware.net/s/MaisAbracos_BR/produtos/";

    @shownIf(this, self => self.have_Thank_You_page === true)
    @title("Confirmation Screen Header")
    @subtitle("The text appears after the successful submission of the form.")
    confirmationHeader: string = "Confirmation Screen Header";

    @shownIf(this, self => self.have_Thank_You_page === true)
    @title("Confirmation Screen Subheader")
    @subtitle("Optional text field")
    confirmationSubheader: string = "Confirmation Screen Subheader";

    @shownIf(this, self => self.have_Thank_You_page === true)
    @title("Confirmation Screen CTA Text")
    confirmationCTAText: string = "Confirmation CTA Text";

    @shownIf(this, self => self.have_Thank_You_page === true)
    @title("Confirmation Screen CTA URL")
    confirmationCTAUrl: string = "https://staging-na01-kimberlyclark.demandware.net/s/MaisAbracos_BR/produtos/";

    run(context: CampaignComponentContext) {
        return {};
    }
}