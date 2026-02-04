import { makeAutoObservable } from "mobx";

export interface IReferenceBook {
  name: string;
  link: string;
  columns: { [key: string]: string };
}

export default class ReferenceBookStore {
  public _referenceBooks: IReferenceBook[] = [
    {
      name: "Справочник кодов категории назначения перевода",
      link: "/reference-book/nsi/transfer-destination-category-code",
      columns: {
        code: "Код назначения платежа",
        name: "Наименование кода назначения платежа",
        additionDate: "Дата добавления",
        isDelete: "Удален",
      },
    },
    {
      name: "Справочник кодов идентификации организации",
      link: "/reference-book/nsi/organization-identification-code",
      columns: {
        code: "Код идентификации организации",
        name: "Наименование кода идентификации организации",
        additionDate: "Дата добавления",
        isDelete: "Удален",
      },
    },
    {
      name: "Справочник кодов отмены перевода",
      link: "/reference-book/nsi/transfer-cancellation-code",
      columns: {
        code: "Код отмены перевода",
        name: "Наименование кода отмены перевода",
        additionDate: "Дата добавления",
        isDelete: "Удален",
      },
    },
    {
      name: "Справочник кодов статусов перевода",
      link: "/reference-book/nsi/transfer-status-code",
      columns: {
        code: "Код статуса перевода",
        name: "Наименование кода статуса перевода",
        additionDate: "Дата добавления",
        isDelete: "Удален",
      },
    },
    {
      name: "Справочник балансовых счетов Национального банка",
      link: "/reference-book/nsi/balance-account-nb",
      columns: {
        firstOrderBalanceAccountNumber:
          "Номер балансового счета 1-го порядка (класс)",
        secondOrderBalanceAccountNumber: "Номер балансового счета 2-го порядка",
        thirdOrderBalanceAccountNumber: "Номер балансового счета 3-го порядка",
        fourthOrderBalanceAccountNumber: "Номер балансового счета 4-го порядка",
        isClose: "Признак закрытия (0 – открыт, 1 – закрыт)",
        characteristic: "Характеристика счета",
        accountNameDetails: "Наименование класса, группы счета и счета",
        additionDate: "Дата добавления",
        isDelete: "Удален",
      },
    },
    {
      name: "Справочник балансовых счетов банков",
      link: "/reference-book/nsi/balance-account",
      columns: {
        firstOrderBalanceAccountNumber:
          "Номер балансового счета 1-го порядка (класс)",
        secondOrderBalanceAccountNumber: "Номер балансового счета 2-го порядка",
        thirdOrderBalanceAccountNumber: "Номер балансового счета 3-го порядка",
        fourthOrderBalanceAccountNumber: "Номер балансового счета 4-го порядка",
        isClose: "Признак закрытия (0 – открыт, 1 – закрыт)",
        characteristic: "Характеристика счета",
        accountNameDetails: "Наименование класса, группы счета и счета",
        additionDate: "Дата добавления",
        isDelete: "Удален",
      },
    },
    {
      name: "Справочник кодов и наименований валют и драгоценных металлов",
      link: "/reference-book/nsi/currency",
      columns: {
        digitalCurrencyCode: "Цифровой код валюты, драгоценного металла",
        letterCurrencyCode: "Буквенный код валюты, драгоценного металла",
        name: "Наименование валюты, драгоценного металла",
        type: "Тип валюты, драгоценного металла",
        decimalPlaces:
          "Число десятичных разрядов у разменной денежной единицы (заполняется для валют, у которых значение определено)",
        expirationDate:
          "Дата вывода национальной или иностранной валюты из обращения (заполняется для валют с типом валюты «8»)",
        additionDate: "Дата добавления",
        isDelete: "Удален",
      },
    },
    {
      name: "Справочник курсов валют",
      link: "/reference-book/nsi/exchange-rate",
      columns: {
        digitalCurrencyCode: "Цифровой код валюты",
        letterCurrencyCode: "Буквенный код валюты",
        data: "Дата начала действия курса",
        countUnits:
          "Количество единиц иностранной валюты, за которое устанавливается официальный курс",
        officialRate:
          "Установленный официальный курс белорусского рубля к иностранной валюте (за количество единиц иностранной валюты)	",
        officialRatePerOneUnit:
          "Официальный курс белорусского рубля к иностранной валюте в представлении по ISO (за 1 единицу иностранной валюты)",
        isDelete: "Удален",
      },
    },
    {
      name: "Справочник банков и НКФО РБ",
      link: "/reference-book/nsi/bank",
      columns: {
        bankCode: "Условный номер участника расчетов (УНУР)",
        name: "Местоположение, наименование участника расчетов",
        regionNumber: "Номер региона",
        identificationCode: "БИК участника расчетов",
        paymentsType: "Вид участника расчетов",
        headBankUNUR: "УНУР головного банка",
        reserve: "Резерв",
        additionDate: "Дата добавления",
        isDelete: "Удален",
      },
    },
    {
      name: "Справочник кодов обработки",
      link: "/reference-book/nsi/processing-code",
      columns: {
        codeAS: "Код АС использования",
        code: "Код обработки",
        name: "Наименование кода обработки",
        additionDate: "Дата добавления",
        isDelete: "Удален",
      },
    },
    {
      name: "Справочник кодов платежей в бюджет",
      link: "/reference-book/nsi/budget-payment-code",
      columns: {
        paymentCode: "Код платежа в бюджет",
        name: "Наименование кода платежа в бюджет",
        isPayRepublicBudget: "Признак уплаты в республиканский бюджет",
        isPayCustomsPayments:
          "Признак уплаты таможенных платежей на единый счет",
        isPaySocialProtectionFund: "Признак уплаты в ФСЗН",
        isPayAdministrators:
          "Признак уплаты на счета администраторов доходов бюджета",
        isPayLocalBudget: "Признак уплаты в местные бюджеты",
        isPayAnotherClients:
          "Признак перечисления на счета иных клиентов казначейства	",
        isPayOutOfBudgetFonds: "Признак платежей во внебюджетные фонды",
        isPayOutOfBudget: "Признак платежей внебюджетных средств",
        additionDate: "Дата добавления",
        isDelete: "Удален",
      },
    },
    {
      name: "Кодификатор стран",
      link: "/reference-book/nsi/country-codifier",
      columns: {
        code: "Код страны цифровой",
        codeA2: "Код страны альфа-2",
        codeA3: "Код страны альфа-3",
        digitalCurrencyCode: "Код валюты цифровой1",
        letterCurrencyCode: "Код валюты буквенный1",
        shortName: "Наименование страны краткое",
        fullName: "Наименование страны полное",
        additionDate: "Дата добавления",
        isDelete: "Удален",
      },
    },
    {
      name: "Справочник счетов по учету средств республиканского бюджета",
      link: "/reference-book/nsi/republican-budget-account",
      columns: {
        identificationCode: "БИК банка бенефициара",
        republicanBudgetAccount:
          "Счет по учету средств республиканского бюджета",
        digitalCurrencyCode: "Код валюты цифровой",
        actualBeneficiaryUNP:
          "УНП фактического бенефициара (клиента казначейства)",
        beneficiaryUNP: "УНП бенефициара",
        actualBeneficiaryName:
          "Наименование фактического бенефициара (клиента казначейства)",
        beneficiaryName: "Наименование бенефициара",
        additionDate: "Дата добавления",
        isDelete: "Удален",
      },
    },
    {
      name: "Справочник банковских идентификационных кодов",
      link: "/reference-book/nsi/bank-id-code",
      columns: {
        unu: "Условный номер участника",
        bic: "БИК банка",
        status: "Статус БИК банка (0 – BIК SWIFT; 1 – БИК Республики Беларусь)",
        accountNumber: "Номер корреспондентского счета банка",
        unp: "УНП (при наличии)",
        bankName: "Наименование участника",
        city: "Населенный пункт",
        controlCode: "Код контроля",
        controlDate: "Дата контроля",
        bicPlus: "БИК правопреемника (при наличии)",
        additionDate: "Дата добавления",
        isDelete: "Удален",
      },
    },
    {
      name: "Справочник участников системы BISS",
      link: "/reference-book/nsi/biss-member",
      columns: {
        unur: "Условный номер участника расчетов",
        bankIdentificationCode: "БИК банка",
        membersAuthenticationCodeForBISS: "Код статуса банка",
        status: "Код аутентификации участника расчетов системы BISS",
        type: "Код типа участника",
        shortName: "Наименование участника расчетов (краткое)",
        cityAndFullName: "Населенный пункт, наименование участника расчетов",
        phone: "Телефон",
        index: "Индекс, адрес",
        additionDate: "Дата добавления",
        isDelete: "Удален",
      },
    },
    {
      name: "Справочник кодов очередностей платежа",
      link: "/reference-book/nsi/payment-priority-code",
      columns: {
        primaryCode: "Код очередности",
        name: "Наименование кода очередности",
        additionDate: "Дата добавления",
        isDelete: "Удален",
      },
    },
    {
      name: "Справочник счетов по учету средств местных бюджетов",
      link: "/reference-book/nsi/local-budget-account",
      columns: {
        identificationCode: "БИК банка бенефициара",
        localBudgetAccount: "Счет по учету средств местного бюджета",
        digitalCurrencyCode: "Код валюты цифровой",
        actualBeneficiaryUNP:
          "УНП фактического бенефициара (местного финансового органа, исполкома)",
        beneficiaryUNP: "УНП бенефициара",
        actualBeneficiaryName:
          "Наименование фактического бенефициара (местного финансового органа, исполкома)",
        beneficiaryName: "Наименование бенефициара",
        additionDate: "Дата добавления",
        isDelete: "Удален",
      },
    },
    {
      name: "Справочник статусов субъектов",
      link: "/reference-book/nsi/subject-statuses",
      columns: {
        code: "Код статуса субъекта",
        name: "Наименование cтатуcа субъекта",
        isUsingBisORIis:
          "Признак использования АС МБР и АИС ПБИ (1 – используется)",
        isUsingFulfillingMonetaryObligationsSystem:
          "Признак использования АИС ИДО (1 – используется)",
        additionDate: "Дата добавления",
        isDelete: "Удален",
      },
    },
    {
      name: "Справочник участников системы SWIFT",
      link: "/reference-book/swift",
      columns: {
        modificationFlag: "Флаг модификации",
        recordKey: "Ключ записи",
        officeType: "",
        parentOfficeKey: "",
        headOfficeKey: "",
        legalType: "",
        legalParentKey: "",
        groupType: "Тип группы",
        groupParentKey: "",
        institutionStatus: "",
        cooperativeGroupKey: "",
        isoLeiCode: "",
        bic8: "",
        branchBic: "",
        bic: "",
        chipsUid: "",
        nationalId: "",
        connectedBic: "",
        institutionName: "",
        branchInformation: "",
        pobNumber: "",
        streetAddress1: "",
        streetAddress2: "",
        streetAddress3: "",
        streetAddress4: "",
        city: "Город",
        cps: "",
        zipCode: "",
        countryName: "",
        isoCountryCode: "",
        timezone: "Часовой пояс",
        subtypeIndicator: "",
        networkConnectivity: "",
        branchQualifiers: "",
        serviceCodes: "",
        ssiGroupKey: "",
        ibanKey: "IBAN ключ",
        fieldA: "Поле А",
        fieldB: "Поле Б",
      },
    },
    {
      name: "Справочник БИК Российской Федерации",
      link: "/reference-book/rf",
      columns: {
        bic: "Банковский идентификационный код",
        name: "Название",
        engName: "Название на английском языке",
        registryNumber: "Регистрационный номер",
        countryCode: "Код страны",
        regionNumber: "Номер региона",
        index: "Индекс",
        typeNp: "Тип населенного пункта",
        nameNp: "Название населенного пункта",
        address: "Адрес",
        parentBic: "Родительский БИК",
        swbic: "Идентификационный код банка, присвоенный SWIFT",
        account: "Аккаунт",
        deleted: "Удален",
      },
    },
    {
      name: "Журнал загрузок",
      link: "/reference-book/statuses",
      columns: {
        id: "ID",
        dateTimeStart: "Дата и время начала действия",
        dateTimeEnd: "Дата и время конца действия",
        username: "Имя пользователя",
        uuid: "Уникальный идентификатор",
        status: "Статус",
        action: "Действие",
      },
    },
  ];

  constructor() {
    makeAutoObservable(this);
  }

  get directories(): IReferenceBook[] {
    return this._referenceBooks;
  }
}
