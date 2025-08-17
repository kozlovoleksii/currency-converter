import { useEffect, useMemo, useState } from "react";
import s from "./Converter.module.css";
import { getLatest, type LatestResponse } from "../../api/exchange";
import CurrencySelect from "../CurrencySelect/CurrencySelect";
import { dict, type Lang } from "../../i18n";

export default function Converter() {
  const [lang, setLang] = useState<Lang>("uk");
  const [amount, setAmount] = useState("100");
  const [valueFirst, setValueFirst] = useState("UAH");
  const [valueSecond, setValueSecond] = useState("USD");
  const [latest, setLatest] = useState<LatestResponse | null>(null);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState("");
  const t = (k: string) => dict[lang][k] ?? k;

  useEffect(() => {
    (async () => {
      try {
        const data = await getLatest();
        setLatest(data);
      } catch (e: any) {
        setError(e?.message ?? "Unknown error");
      }
    })();
  }, []);

  const rates = latest?.rates ?? {};

  const parseAmount = (raw: string) => {
    const trimmed = raw.trim();
    const normalized = trimmed.replace(",", ".");
    const cleaned = normalized.replace(/[^0-9.]/g, "");
    const singleDot = cleaned.replace(/(\..*)\./g, "$1");
    return Number(singleDot);
  };

  const amountNum = parseAmount(amount);
  const isAmountValid =
    Number.isFinite(amountNum) && amount.trim() !== "" && amountNum >= 0;
  const canConvert = !!latest && isAmountValid;

  const from = valueFirst;
  const to = valueSecond;
  const pairRate = rates[from] && rates[to] ? rates[from] / rates[to] : null;

  const sortedCurrencies = useMemo(() => {
    const currencies = Object.entries(rates).map(([code, value]) => ({
      code,
      value,
    }));
    return currencies.sort((a, b) => a.code.localeCompare(b.code));
  }, [rates]);

  const codes = useMemo(
    () => sortedCurrencies.map((c) => c.code),
    [sortedCurrencies]
  );

  const today = new Date().toLocaleDateString("uk-UA");

  function recalc(fromCode: string, toCode: string) {
    if (!latest) return setResult("");
    const r = latest.rates;
    const pair = r[fromCode] && r[toCode] ? r[fromCode] / r[toCode] : null;
    setResult(
      pair !== null && !Number.isNaN(amountNum)
        ? (amountNum * pair).toFixed(2)
        : ""
    );
  }

  function onConvert() {
    recalc(valueFirst, valueSecond);
  }

  function onSwap() {
    const fromNext = valueSecond;
    const toNext = valueFirst;
    setValueFirst(fromNext);
    setValueSecond(toNext);
    if (canConvert) recalc(fromNext, toNext);
  }

  return (
    <div className={`card ${s.wrapper}`}>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={() => setLang("uk")}
          className={
            s.smallToggle + (lang === "uk" ? " " + s.activeToggle : "")
          }
          aria-pressed={lang === "uk"}
        >
          UA
        </button>
        <button
          type="button"
          onClick={() => setLang("en")}
          className={
            s.smallToggle + (lang === "en" ? " " + s.activeToggle : "")
          }
          aria-pressed={lang === "en"}
        >
          EN
        </button>
      </div>

      <h2>{t("title")}</h2>

      <label>
        <div className="label">{t("amountLabel")}</div>
        <input
          className={`input ${!isAmountValid ? s.inputError : ""}`}
          value={amount}
          onChange={(e) => {
            const next = e.target.value.replace(/[^\d.,\s]/g, "");
            setAmount(next);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && canConvert) onConvert();
          }}
          placeholder={t("amountPlaceholder")}
          inputMode="decimal"
        />
      </label>

      <div className={s.row}>
        <CurrencySelect
          value={valueFirst}
          options={codes}
          onChange={setValueFirst}
        />

        <button
          className={s.swapBtn}
          title={t("swap")}
          onClick={onSwap}
          style={{ transform: "rotate(90deg)" }}
        >
          ⇅
        </button>

        <CurrencySelect
          value={valueSecond}
          options={codes}
          onChange={setValueSecond}
        />
      </div>

      <div className={s.rateBox}>
        {pairRate !== null ? `1 ${from} = ${pairRate.toFixed(4)} ${to}` : "—"}
      </div>

      <button className={s.button} onClick={onConvert} disabled={!canConvert}>
        {t("convert")}
      </button>

      <div className={s.rateBox}>{result ? `${result} ${to}` : "—"}</div>

      <div className={s.smallNote}>
        <a
          href="https://bank.gov.ua/ua/markets/exchangerates"
          target="_blank"
          className={s.smallNoteText}
          rel="noreferrer"
        >
          {t("nbu")}
        </a>
        {` ${today}`}
      </div>

      {error && <div className={s.errorMsg}>Помилка: {error}</div>}
    </div>
  );
}
