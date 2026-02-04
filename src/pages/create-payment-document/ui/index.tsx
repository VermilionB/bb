/* eslint-disable max-lines */
import { FC, useState } from "react";
import {
  Button,
  Checkbox,
  Group,
  Radio,
  RadioGroup,
  Stack,
  Tabs,
} from "@mantine/core";
import { ChildrenPanel } from "@pages/create-payment-document/ui/children-panel";
import { PaymentDocumentInput } from "@pages/create-payment-document/ui/components/payment-document-input/payement-document-input.tsx";

import styles from "./index.module.scss";

export const CreatePaymentDocument: FC = () => {
  // eslint-disable-next-line unicorn/no-null
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <Button w={100} h={30} p={0} radius="xs" color="#007458">
          Провести
        </Button>
        <Button w={100} h={30} p={0} radius="xs" color="#007458">
          Отложить
        </Button>
        <Button w={100} h={30} p={0} radius="xs" color="#007458">
          Проверить
        </Button>
      </div>
      <Tabs defaultValue="main-details">
        <Tabs.List>
          <Tabs.Tab value="main-details">Основные реквизиты</Tabs.Tab>
          <Tabs.Tab value="payment-details">Детали платежа</Tabs.Tab>
          <Tabs.Tab value="rf-kz-india">
            Платежи в РФ, Казахстан и Индию
          </Tabs.Tab>
          <Tabs.Tab value="automatic-details">
            Автоматические реквизиты
          </Tabs.Tab>
          <Tabs.Tab value="administrative-data">
            Административные данные
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="main-details" pl={16}>
          <div className={styles.content}>
            <ChildrenPanel title={"Основные реквизиты"}>
              <>
                <Group align={"end"}>
                  <PaymentDocumentInput
                    width={100}
                    title={<span>Вид документа</span>}
                    type={"copy"}
                    icon={true}
                  />
                  <span style={{ marginBottom: "4px" }}>
                    ПЛАТЕЖНОЕ ПОРУЧЕНИЕ
                  </span>
                </Group>
                <Group>
                  <PaymentDocumentInput
                    width={228}
                    title={<span>№ документа</span>}
                    type={"copy"}
                    icon={false}
                  />
                  <PaymentDocumentInput
                    width={275}
                    title={<span>Дата документа</span>}
                    type={"date"}
                    icon={true}
                  />
                </Group>
              </>
            </ChildrenPanel>
            <ChildrenPanel title={"Сумма и валюта"}>
              <>
                <Group align={"end"}>
                  <PaymentDocumentInput
                    width={228}
                    title={<span>Валюта</span>}
                    type={"copy"}
                    icon={true}
                  />
                  <PaymentDocumentInput
                    width={400}
                    title={<span>Курс валюты</span>}
                    type={"copy"}
                    icon={false}
                  />
                </Group>
                <Group>
                  <PaymentDocumentInput
                    width={228}
                    title={<span>Сумма</span>}
                    icon={false}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={400}
                    title={<span>Сумма прописью</span>}
                    icon={false}
                    type={"text"}
                  />
                </Group>
                <Group>
                  <PaymentDocumentInput
                    width={228}
                    title={<span>Сумма комиссии</span>}
                    icon={false}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={275}
                    title={<span>Признак срочности</span>}
                    icon={false}
                    type={"copy"}
                  />
                </Group>
              </>
            </ChildrenPanel>
            <ChildrenPanel title={"Плательщик"}>
              <>
                <Group>
                  <PaymentDocumentInput
                    width={100}
                    title={<span>Страна банка</span>}
                    icon={true}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={112}
                    title={<span>Код банка</span>}
                    icon={true}
                    type={"copy"}
                  />
                  <span style={{ marginTop: "30px" }}>
                    Г. МИНСК, ОАО “АСБ БЕЛАРУСБАНК”
                  </span>
                </Group>
                <Group>
                  <PaymentDocumentInput
                    width={400}
                    title={<span>№ счета</span>}
                    icon={true}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={118}
                    title={<span>Валюта счета</span>}
                    icon={true}
                    type={"copy"}
                  />
                </Group>
                <Group>
                  <PaymentDocumentInput
                    width={118}
                    title={<span>Деловой партнер</span>}
                    icon={true}
                    type={"copy"}
                  />
                  <span style={{ marginTop: "30px" }}>
                    ИП Иванов Иван Иванович
                  </span>
                </Group>
              </>
            </ChildrenPanel>
            <ChildrenPanel title={"Данные плательщика"}>
              <>
                <Group align={"end"}>
                  <PaymentDocumentInput
                    width={100}
                    title={
                      <span>
                        Страна <br /> регистрации
                      </span>
                    }
                    icon={true}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={119}
                    title={
                      <span>
                        Идентификационный
                        <br /> номер
                      </span>
                    }
                    icon={false}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={369}
                    title={<span>Наименование фактическое</span>}
                    icon={false}
                    type={"copy"}
                  />
                </Group>
                <Group>
                  <PaymentDocumentInput
                    width={100}
                    title={<span>Страна</span>}
                    icon={true}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={528}
                    title={<span>Населенный пункт</span>}
                    icon={true}
                    type={"copy"}
                  />
                </Group>
                <Group>
                  <PaymentDocumentInput
                    width={644}
                    title={<span>Адрес</span>}
                    icon={false}
                    type={"copy"}
                  />
                </Group>
              </>
            </ChildrenPanel>
            <ChildrenPanel title={"Бенефициар"}>
              <>
                <Group align={"end"}>
                  <PaymentDocumentInput
                    width={100}
                    title={<span>Страна банка</span>}
                    icon={true}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={112}
                    title={<span>Код банка</span>}
                    icon={true}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={156}
                    title={<span>SWIFT-код</span>}
                    icon={true}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={228}
                    title={<span>№ счета Банка получателя</span>}
                    icon={false}
                    type={"copy"}
                  />
                </Group>
                <Group>
                  <PaymentDocumentInput
                    width={644}
                    title={<span>Наименование банка получателя</span>}
                    icon={false}
                    type={"copy"}
                  />
                </Group>
                <Group>
                  <PaymentDocumentInput
                    width={228}
                    title={<span>№ счета</span>}
                    icon={true}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={156}
                    title={<span>Валюта счета</span>}
                    icon={true}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={228}
                    title={<span>Сумма в валюте получателя</span>}
                    icon={false}
                    type={"copy"}
                  />
                </Group>
              </>
            </ChildrenPanel>
            <ChildrenPanel title={"Данные бенефициара"}>
              <>
                <Group align={"end"}>
                  <PaymentDocumentInput
                    width={100}
                    title={
                      <span>
                        Страна <br />
                        Регигистрации
                      </span>
                    }
                    icon={true}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={143}
                    title={
                      <span>
                        Идентификационный <br /> Номер
                      </span>
                    }
                    icon={false}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={369}
                    title={<span>Наименование фактическое</span>}
                    icon={false}
                    type={"copy"}
                  />
                </Group>
                <Group>
                  <PaymentDocumentInput
                    width={100}
                    title={<span>Страна</span>}
                    icon={true}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={528}
                    title={<span>Населенный пункт</span>}
                    icon={false}
                    type={"copy"}
                  />
                </Group>
                <Group>
                  <PaymentDocumentInput
                    width={644}
                    title={<span>Адрес</span>}
                    icon={false}
                    type={"copy"}
                  />
                </Group>
              </>
            </ChildrenPanel>
            <ChildrenPanel title={"Назначение платежа"}>
              <>
                <Group>
                  <PaymentDocumentInput
                    width={644}
                    title={<span>Назначение платежа</span>}
                    icon={false}
                    type={"copy"}
                  />
                </Group>
                <Group>
                  <PaymentDocumentInput
                    width={203}
                    title={<span>УНП плательщика</span>}
                    icon={false}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={203}
                    title={<span>УНП получателя</span>}
                    icon={false}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={203}
                    title={<span>УНП 3-го лица</span>}
                    icon={false}
                    type={"copy"}
                  />
                </Group>
                <Group align={"end"}>
                  <PaymentDocumentInput
                    width={100}
                    title={<span>Код платежа</span>}
                    icon={true}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={87}
                    title={<span>Очередность</span>}
                    icon={true}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={117}
                    title={
                      <span>
                        Код валютной <br /> операции
                      </span>
                    }
                    icon={true}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={134}
                    title={<span>Вид операции дебет</span>}
                    icon={true}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={142}
                    title={<span>Вид операции кредит</span>}
                    icon={true}
                    type={"copy"}
                  />
                </Group>
              </>
            </ChildrenPanel>
            <ChildrenPanel title={"Корреспондент банка-бенефициара"}>
              <>
                <Group>
                  <PaymentDocumentInput
                    width={100}
                    title={<span>Страна банка</span>}
                    icon={true}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={112}
                    title={<span>Код банка</span>}
                    icon={true}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={156}
                    title={<span>SWIFT-код</span>}
                    icon={true}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={228}
                    title={<span>№ счета</span>}
                    icon={true}
                    type={"copy"}
                  />
                </Group>
                <Group>
                  <PaymentDocumentInput
                    width={644}
                    title={<span>Наименование банка</span>}
                    icon={true}
                    type={"copy"}
                  />
                </Group>
              </>
            </ChildrenPanel>
            <ChildrenPanel title={"Корреспондент банка-отправителя"}>
              <>
                <Group>
                  <PaymentDocumentInput
                    width={100}
                    title={<span>Страна банка</span>}
                    icon={true}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={112}
                    title={<span>Код банка</span>}
                    icon={true}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={156}
                    title={<span>SWIFT-код</span>}
                    icon={true}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={228}
                    title={<span>№ счета</span>}
                    icon={true}
                    type={"copy"}
                  />
                </Group>
                <Group>
                  <PaymentDocumentInput
                    width={644}
                    title={<span>Наименование банка</span>}
                    icon={true}
                    type={"copy"}
                  />
                </Group>
              </>
            </ChildrenPanel>
            <ChildrenPanel title={"Банк-посредник для банка-корреспондента"}>
              <>
                <Group>
                  <PaymentDocumentInput
                    width={100}
                    title={<span>Страна банка</span>}
                    icon={true}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={112}
                    title={<span>Код банка</span>}
                    icon={true}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={156}
                    title={<span>SWIFT-код</span>}
                    icon={true}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={228}
                    title={<span>№ счета</span>}
                    icon={true}
                    type={"copy"}
                  />
                </Group>
                <Group>
                  <PaymentDocumentInput
                    width={644}
                    title={<span>Наименование банка</span>}
                    icon={true}
                    type={"copy"}
                  />
                </Group>
              </>
            </ChildrenPanel>
            <ChildrenPanel title={"Признаки"}>
              <>
                <span style={{ paddingTop: "8px", marginBottom: "-8px" }}>
                  Расходы по переводу
                </span>
                <RadioGroup
                  value={selectedValue}
                  onChange={setSelectedValue}
                  required
                >
                  <Group mt={8}>
                    <Radio value="OUR" label="Плательщик (OUR)" />
                    <Radio value="FRE" label="Не взимается (FRE)" />
                    <Radio value="SHA" label="Плательщик/Бенефициар (SHA)" />
                  </Group>
                  <Group mt={8}>
                    <Radio value="BEN" label="Бенефициар (BEN)" />
                    <Radio value="OUROUR" label="Гарант (OUROUR)" />
                  </Group>
                </RadioGroup>
                <Group>
                  <PaymentDocumentInput
                    width={322}
                    title={<span>Счет комиссии</span>}
                    icon={true}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={120}
                    title={<span>Валюта комиссии</span>}
                    icon={true}
                    type={"copy"}
                  />
                  <PaymentDocumentInput
                    width={170}
                    title={<span>Дата оказания услуги</span>}
                    icon={true}
                    type={"copy"}
                  />
                </Group>
                <Group mt={8} align={"start"}>
                  <Stack>
                    <Checkbox label="Игнорировать блокир" />
                    <Checkbox label="Не формировать MT в SWIFT" />
                    <Checkbox
                      label="Платеж в счет забронированной суммы"
                      disabled
                    />
                    <Checkbox label="Без комиссии" />
                  </Stack>
                  <PaymentDocumentInput
                    type={"dropdown"}
                    width={306}
                    icon={false}
                    title={<span>Дополнительный параметр</span>}
                  />
                </Group>
              </>
            </ChildrenPanel>
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="payment-details" pl={16}>
          <div className={styles.content}>
            <ChildrenPanel title={"Детали платежа"}>
              <>
                <Stack>
                  <PaymentDocumentInput
                    type={"copy"}
                    width={644}
                    title={<span>Детали платежа</span>}
                    icon={false}
                  />
                  <PaymentDocumentInput
                    type={"copy"}
                    width={644}
                    title={<span>Детали платежа</span>}
                    icon={false}
                  />
                  <PaymentDocumentInput
                    type={"copy"}
                    width={644}
                    title={<span>Детали платежа</span>}
                    icon={false}
                  />
                  <PaymentDocumentInput
                    type={"copy"}
                    width={644}
                    title={<span>Детали платежа</span>}
                    icon={false}
                  />
                  <PaymentDocumentInput
                    type={"copy"}
                    width={644}
                    title={<span>Детали платежа</span>}
                    icon={false}
                  />
                </Stack>
              </>
            </ChildrenPanel>
            <ChildrenPanel title={"Документы ВЭД"}>
              <>
                <Group>
                  <PaymentDocumentInput
                    type={"copy"}
                    width={314}
                    title={<span>Номер документа ВЭД</span>}
                    icon={false}
                  />
                  <PaymentDocumentInput
                    type={"copy"}
                    width={314}
                    title={<span>Код ТН ВЭД</span>}
                    icon={false}
                  />
                </Group>
              </>
            </ChildrenPanel>
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="rf-kz-india" pl={16}>
          <div className={styles.content}>
            <ChildrenPanel title={"Платежи в бюджет РФ"}>
              <>
                <Group>
                  <PaymentDocumentInput
                    type={"copy"}
                    width={149}
                    title={<span>Код операции</span>}
                    icon={true}
                  />
                  <PaymentDocumentInput
                    type={"copy"}
                    width={314}
                    title={<span>Код основного налогового плательщика</span>}
                    icon={true}
                  />
                </Group>
                <Group>
                  <PaymentDocumentInput
                    type={"copy"}
                    width={149}
                    title={<span>Код выплат</span>}
                    icon={true}
                  />
                  <PaymentDocumentInput
                    type={"copy"}
                    width={149}
                    title={<span>КПП получателя</span>}
                    icon={false}
                  />
                  <PaymentDocumentInput
                    type={"copy"}
                    width={314}
                    title={<span>Уникальный идентификатор платежа</span>}
                    icon={false}
                  />
                </Group>
                <Group>
                  <PaymentDocumentInput
                    type={"copy"}
                    width={314}
                    title={<span>Код бюджетной классификации</span>}
                    icon={false}
                  />
                  <PaymentDocumentInput
                    type={"copy"}
                    width={149}
                    title={<span>Код ОКТМО</span>}
                    icon={false}
                  />
                </Group>
                <Group>
                  <PaymentDocumentInput
                    title={
                      <span>
                        Показ налогового периода/код таможенной <br />{" "}
                        организации
                      </span>
                    }
                    icon={false}
                    type={"copy"}
                    width={314}
                  />
                  <PaymentDocumentInput
                    title={
                      <span>
                        Дата налогового <br /> документа
                      </span>
                    }
                    icon={true}
                    type={"date"}
                    width={149}
                  />
                  <PaymentDocumentInput
                    title={
                      <span>
                        № налогового <br /> документа
                      </span>
                    }
                    icon={false}
                    type={"copy"}
                    width={149}
                  />
                </Group>
              </>
            </ChildrenPanel>
            <ChildrenPanel title={"Выплаты физическим лицам на территории РФ"}>
              <PaymentDocumentInput
                title={<span>Код вида дохода</span>}
                icon={false}
                type={"copy"}
                width={149}
              />
            </ChildrenPanel>
            <ChildrenPanel title={"Платежи в Казахстан"}>
              <>
                <Group align={"end"}>
                  <PaymentDocumentInput
                    title={
                      <span>
                        Код назначения
                        <br /> платежа
                      </span>
                    }
                    icon={false}
                    type={"copy"}
                    width={149}
                  />
                  <PaymentDocumentInput
                    title={
                      <span>
                        Код отправленных <br /> средств
                      </span>
                    }
                    icon={true}
                    type={"copy"}
                    width={149}
                  />
                  <PaymentDocumentInput
                    title={<span>Код бенефициара</span>}
                    icon={true}
                    type={"copy"}
                    width={149}
                  />
                  <PaymentDocumentInput
                    title={
                      <span>
                        Код бюджетной <br />
                        классификации
                      </span>
                    }
                    icon={false}
                    type={"copy"}
                    width={149}
                  />
                </Group>
                <Group>
                  <PaymentDocumentInput
                    title={<span>Тип идентификационного номера</span>}
                    icon={true}
                    type={"copy"}
                    width={314}
                  />
                  <PaymentDocumentInput
                    title={<span>Идентификационный номер</span>}
                    icon={false}
                    type={"copy"}
                    width={314}
                  />
                </Group>
              </>
            </ChildrenPanel>
            <Group>
              <ChildrenPanel
                title={"Идентификация организации: Плательщик"}
                customWidth={314}
              >
                <Group>
                  <PaymentDocumentInput
                    width={149}
                    title={<span>LEI</span>}
                    type={"copy"}
                    icon={false}
                  />
                  <PaymentDocumentInput
                    width={149}
                    title={<span>БИК</span>}
                    type={"copy"}
                    icon={false}
                  />
                </Group>
              </ChildrenPanel>
              <ChildrenPanel
                title={"Идентификация организации: Бенефициар"}
                customWidth={314}
              >
                <Group>
                  <PaymentDocumentInput
                    width={149}
                    title={<span>LEI</span>}
                    type={"copy"}
                    icon={false}
                  />
                  <PaymentDocumentInput
                    width={149}
                    title={<span>БИК</span>}
                    type={"copy"}
                    icon={false}
                  />
                </Group>
              </ChildrenPanel>
            </Group>
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="automatic-details" pl={16}>
          <div className={styles.content}>
            <ChildrenPanel title={"Даты обработки"}>
              <>
                <Group>
                  <PaymentDocumentInput
                    width={314}
                    icon={true}
                    type={"date"}
                    title={<span>Дата и время поступления</span>}
                  />
                  <PaymentDocumentInput
                    width={314}
                    icon={true}
                    type={"date"}
                    title={<span>Дата исполнения платежного документа</span>}
                  />
                </Group>
                <Group>
                  <PaymentDocumentInput
                    width={314}
                    icon={true}
                    type={"date"}
                    title={<span>Дата валютирования по дебету</span>}
                  />
                  <PaymentDocumentInput
                    width={314}
                    icon={true}
                    type={"date"}
                    title={<span>Дата валютирования по кредиту</span>}
                  />
                </Group>
              </>
            </ChildrenPanel>
            <ChildrenPanel title={"Документ, на основании которого создана ПИ"}>
              <>
                <Group>
                  <PaymentDocumentInput
                    width={314}
                    icon={false}
                    type={"copy"}
                    title={<span>№ расчетного документа</span>}
                  />
                  <PaymentDocumentInput
                    width={314}
                    icon={true}
                    type={"date"}
                    title={<span>Дата расчетного документа</span>}
                  />
                </Group>
              </>
            </ChildrenPanel>
            <ChildrenPanel title={"Реквизиты DM"}>
              <>
                <Group align={"end"}>
                  <PaymentDocumentInput
                    width={314}
                    icon={true}
                    type={"copy"}
                    title={<span>Средство представления ПИ в банк</span>}
                  />
                  <span style={{ marginBottom: "4px" }}>Клиент-банк</span>
                </Group>
                <Group align={"end"}>
                  <PaymentDocumentInput
                    width={314}
                    icon={true}
                    type={"copy"}
                    title={<span>Способ платежа</span>}
                  />
                  <span style={{ marginBottom: "4px" }}>SWIFT 103,202,399</span>
                </Group>
              </>
            </ChildrenPanel>
            <ChildrenPanel title={"Реквизиты PTS"}>
              <>
                <Group align={"end"}>
                  <PaymentDocumentInput
                    width={177}
                    icon={false}
                    type={"copy"}
                    title={<span>Референс операции (20:)</span>}
                  />
                  <PaymentDocumentInput
                    width={177}
                    icon={false}
                    type={"copy"}
                    title={<span>Связанный референс (21:)</span>}
                  />
                </Group>
                <PaymentDocumentInput
                  width={644}
                  icon={true}
                  type={"dropdown"}
                  title={<span>Тип исходного сообщения</span>}
                />
              </>
            </ChildrenPanel>
            <ChildrenPanel title={"Реквизиты BISS"}>
              <Group align={"end"}>
                <PaymentDocumentInput
                  width={314}
                  icon={false}
                  type={"copy"}
                  title={<span>Код банковской операции</span>}
                />
                <PaymentDocumentInput
                  width={149}
                  icon={false}
                  type={"copy"}
                  title={<span>Вид платежа</span>}
                />
                <PaymentDocumentInput
                  width={149}
                  icon={false}
                  type={"copy"}
                  title={<span>Детали расходов</span>}
                />
              </Group>
            </ChildrenPanel>
            <ChildrenPanel title={"Реквизиты ISO20022"}>
              <>
                <Group align={"end"}>
                  <PaymentDocumentInput
                    width={231.5}
                    icon={false}
                    type={"copy"}
                    title={<span>Код назначения платежа (букв)</span>}
                  />
                  <PaymentDocumentInput
                    width={231.5}
                    icon={false}
                    type={"copy"}
                    title={<span>Код назначения платежа (цифр)</span>}
                  />
                  <PaymentDocumentInput
                    width={149}
                    icon={true}
                    type={"copy"}
                    title={<span>Признак платежа</span>}
                  />
                </Group>
                <Group align={"end"}>
                  <PaymentDocumentInput
                    width={139}
                    icon={true}
                    type={"copy"}
                    title={
                      <span>
                        Приоритет <br />
                        банковского <br />
                        перевода
                      </span>
                    }
                  />
                  <PaymentDocumentInput
                    width={119}
                    icon={false}
                    type={"copy"}
                    title={
                      <span>
                        Приоритет <br /> обработки
                      </span>
                    }
                  />
                  <PaymentDocumentInput
                    width={145}
                    icon={true}
                    type={"copy"}
                    title={
                      <span>
                        Плательщик <br /> комиссии
                      </span>
                    }
                  />
                  <PaymentDocumentInput
                    width={127}
                    icon={true}
                    type={"copy"}
                    title={<span>Тип MX-сообщения</span>}
                  />
                  <PaymentDocumentInput width={58} icon={true} type={"copy"} />
                </Group>
              </>
            </ChildrenPanel>
            <ChildrenPanel title={"Реквизиты физического лица плательщика"}>
              <>
                <Group align={"end"}>
                  <PaymentDocumentInput
                    width={139}
                    icon={false}
                    type={"copy"}
                    title={<span>Код вида документа</span>}
                  />
                  <PaymentDocumentInput
                    width={144}
                    icon={false}
                    type={"copy"}
                    title={
                      <span>
                        Серия и номер <br /> документа
                      </span>
                    }
                  />
                  <PaymentDocumentInput
                    width={180}
                    icon={false}
                    type={"copy"}
                    title={
                      <span>
                        Идентификационный <br /> номер документа
                      </span>
                    }
                  />
                  <PaymentDocumentInput
                    width={133}
                    icon={true}
                    type={"copy"}
                    title={
                      <span>
                        Дата выдачи <br /> документа
                      </span>
                    }
                  />
                </Group>
                <Group align={"end"}>
                  <PaymentDocumentInput
                    width={643}
                    icon={false}
                    type={"copy"}
                    title={<span>Орган, выдавший документ</span>}
                  />
                </Group>
              </>
            </ChildrenPanel>
            <ChildrenPanel title={"Реквизиты физического лица бенефициара"}>
              <>
                <Group align={"end"}>
                  <PaymentDocumentInput
                    width={139}
                    icon={false}
                    type={"copy"}
                    title={<span>Код вида документа</span>}
                  />
                  <PaymentDocumentInput
                    width={144}
                    icon={false}
                    type={"copy"}
                    title={
                      <span>
                        Серия и номер <br /> документа
                      </span>
                    }
                  />
                  <PaymentDocumentInput
                    width={180}
                    icon={false}
                    type={"copy"}
                    title={
                      <span>
                        Идентификационный <br /> номер документа
                      </span>
                    }
                  />
                  <PaymentDocumentInput
                    width={133}
                    icon={true}
                    type={"copy"}
                    title={
                      <span>
                        Дата выдачи <br /> документа
                      </span>
                    }
                  />
                </Group>
                <Group align={"end"}>
                  <PaymentDocumentInput
                    width={643}
                    icon={false}
                    type={"copy"}
                    title={<span>Орган, выдавший документ</span>}
                  />
                </Group>
              </>
            </ChildrenPanel>
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="administrative-data" pl={16}>
          <div className={styles.content}>
            <ChildrenPanel title={"Платежное поручение"}>
              <PaymentDocumentInput
                type={"copy"}
                width={314}
                title={<span>Идентификатор платежного поручения</span>}
                icon={false}
              />
            </ChildrenPanel>
            <ChildrenPanel title={"Статус"}>
              <>
                <Group align={"end"}>
                  <PaymentDocumentInput
                    type={"copy"}
                    width={161}
                    title={
                      <span>
                        Имя пользователя <br /> создавшего
                      </span>
                    }
                    icon={false}
                  />
                  <PaymentDocumentInput
                    type={"copy"}
                    width={168}
                    title={
                      <span>
                        Имя пользователя <br /> изменившего
                      </span>
                    }
                    icon={false}
                  />
                  <PaymentDocumentInput
                    type={"copy"}
                    width={147}
                    title={
                      <span>
                        Имя пользователя <br /> деблокировавшего
                      </span>
                    }
                    icon={false}
                  />
                  <PaymentDocumentInput
                    type={"copy"}
                    width={120}
                    title={<span>Статус</span>}
                    icon={false}
                  />
                </Group>
              </>
            </ChildrenPanel>
            <ChildrenPanel title={"Технические поля ISO20022"}>
              <>
                <Group align={"end"}>
                  <PaymentDocumentInput
                    type={"copy"}
                    width={314}
                    title={<span>MessageIdentification</span>}
                    icon={false}
                  />
                  <PaymentDocumentInput
                    type={"copy"}
                    width={314}
                    title={<span>InstructionIdentification</span>}
                    icon={false}
                  />
                </Group>
                <Group align={"end"}>
                  <PaymentDocumentInput
                    type={"copy"}
                    width={314}
                    title={<span>EndToEndIdentification</span>}
                    icon={false}
                  />
                  <PaymentDocumentInput
                    type={"copy"}
                    width={314}
                    title={<span>UETR</span>}
                    icon={false}
                  />
                </Group>
              </>
            </ChildrenPanel>
          </div>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};
