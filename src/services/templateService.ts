
import Handlebars from 'handlebars';
import { ReportType, OpjSijinReportData, DattReportData, InpecReportData, OtherOpjEntry, BaseReportData, AdditionalAccusedEntry } from '../types';

const spanishMonths: string[] = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

const CORREGIMIENTOS_LIST: string[] = [
  "punta arena", "caño del oro", "tierrabomba", "bocachica", "ararca", "barú", "santa ana",
  "islas del rosario", "bayunca", "la boquilla", "pasacaballos", "pontezuela", "tierra baja",
  "punta canoa", "membrillal", "manzanillo del mar", "arroyo grande", "arroyo de piedra", "arroyo de las canoas"
].map(c => c.toLowerCase());

Handlebars.registerHelper('isCorregimiento', function (this: any, municipality: string, options: Handlebars.HelperOptions) {
  if (typeof municipality === 'string' && CORREGIMIENTOS_LIST.includes(municipality.toLowerCase())) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('isCartagena', function (this: any, municipality: string, options: Handlebars.HelperOptions) {
  if (typeof municipality === 'string' && municipality.toLowerCase() === 'cartagena') {
    return options.fn(this);
  }
  return options.inverse(this);
});

const formatDateHelper = (dateString: string): string => {
  if (!dateString) return 'N/A';
  try {
    let year: number, month: number, day: number;
    if (dateString.includes('/')) {
        const parts = dateString.split('/');
        if (parts.length === 3) { day = parseInt(parts[0], 10); month = parseInt(parts[1], 10); year = parseInt(parts[2], 10); } 
        else { return dateString; }
    } else if (dateString.includes('-')) {
        const parts = dateString.split('-');
        if (parts.length === 3) { year = parseInt(parts[0], 10); month = parseInt(parts[1], 10); day = parseInt(parts[2], 10); } 
        else { return dateString; }
    } else { return dateString; }
    
    if (isNaN(day) || isNaN(month) || isNaN(year) || month < 1 || month > 12 || day < 1 || day > 31) {
      return dateString; 
    }
    return `${day} de ${spanishMonths[month - 1]} de ${year}`;
  } catch (e) {
    console.error("Error formatting date:", e, "Input:", dateString);
    return dateString; 
  }
};

Handlebars.registerHelper('formatDate', formatDateHelper);

Handlebars.registerHelper('formatId', function(idNumber: string) {
  if (typeof idNumber !== 'string' || !idNumber) return '';
  const num = parseInt(idNumber.replace(/\D/g, ''), 10);
  if (isNaN(num)) return idNumber;
  return num.toLocaleString('de-DE');
});

Handlebars.registerHelper('idNoDots', function(idNumber: string) {
  if (typeof idNumber !== 'string' || !idNumber) return '';
  return idNumber.replace(/\./g, '').replace(/,/g, '');
});

Handlebars.registerHelper('join', function(arr: any[], propertyName: string, separator: string = ', ', finalConjunction?: string) {
  if (!Array.isArray(arr) || arr.length === 0) return '';
  const items = arr.map(item => item && typeof item === 'object' && propertyName ? item[propertyName] : item);
  if (items.length === 1) return items[0];
  if (finalConjunction) {
    if (items.length === 2) return `${items[0]} ${finalConjunction} ${items[1]}`;
    return `${items.slice(0, -1).join(separator)} ${finalConjunction} ${items[items.length - 1]}`;
  }
  return items.join(separator);
});

Handlebars.registerHelper('calculateFolios', function(arr: any[] | undefined, itemsPerFolio: number = 5) {
  if (!arr || arr.length === 0) return 1; 
  if (arr.length < itemsPerFolio) return 1;
  return Math.ceil(arr.length / itemsPerFolio);
});

Handlebars.registerHelper('arrayLength', function (array: any[] | undefined): number {
  if (Array.isArray(array)) {
    return array.length;
  }
  return 0; 
});

Handlebars.registerHelper('eq', function (v1: any, v2: any): boolean {
  return v1 === v2;
});

Handlebars.registerHelper('gt', function (v1: number, v2: number): boolean {
  return v1 > v2;
});

Handlebars.registerHelper('lt', function (v1: number, v2: number): boolean {
  return v1 < v2;
});

Handlebars.registerHelper('gte', function (v1: number, v2: number): boolean {
  return v1 >= v2;
});

Handlebars.registerHelper('lte', function (v1: number, v2: number): boolean {
  return v1 <= v2;
});

Handlebars.registerHelper('subtract', function(a: number, b: number): number {
  return a - b;
});

Handlebars.registerHelper('toUpperCase', function(str: string) {
  if (typeof str === 'string') {
    return str.toUpperCase();
  }
  return '';
});

const prepareBaseReportData = (data: BaseReportData): Record<string, any> => {
    return {
        eventDate: formatDateHelper(data.eventDate), 
        eventMunicipality: data.eventMunicipality,
        eventAddress: data.eventAddress,
        eventModality: data.eventModality,
        officialRank: data.officialRank,
        officialReport: data.officialReport,
    };
};

export const generateReportText = (
  reportType: ReportType, 
  data: OpjSijinReportData | DattReportData | InpecReportData,
  templateString: string 
): string => {
  if (!Handlebars) {
    console.error("Handlebars no está cargado.");
    return "Error: Handlebars no está disponible.";
  }

  let context: Record<string, any> = prepareBaseReportData(data);

  if (reportType === ReportType.OPJ_SIJIN) {
    const opjSijinData = data as OpjSijinReportData;
    context.otherOpjs = opjSijinData.otherOpjs.map(opj => ({
      ...opj,
      opjDate: formatDateHelper(opj.opjDate) 
    }));
  } else if (reportType === ReportType.INPEC) {
    const inpecData = data as InpecReportData;
    context.penitentiaryName = inpecData.penitentiaryName || '';
  }
  
  try {
    const compiledTemplate = Handlebars.compile(templateString);
    let resultText = compiledTemplate(context);

    if (reportType === ReportType.OPJ_SIJIN) {
      const opjSijinData = data as OpjSijinReportData;
      if (!opjSijinData.otherOpjs || opjSijinData.otherOpjs.length === 0) {
        resultText = resultText.replace(/\n{3,}/g, '\n\n');
      }
    }
    return resultText;
  } catch (e) {
    console.error(`Error compilando o ejecutando plantilla Handlebars para ${reportType}:`, e);
    return `Error al generar informe con Handlebars: ${(e as Error).message}`;
  }
};

interface ParagraphDataContext {
  accusedInfoWebService?: string;
  folioCountWebService?: number;
  responseWebService?: string;
  accusedNamesAni?: string;
  folioCountAni?: number;
  officialAnswerQuery?: string;
  responseAni?: string;
  additionalAccused?: AdditionalAccusedEntry[];
}


export const generateParagraphText = (
  paragraphType: 'WEB_SERVICE' | 'ANI',
  data: { officialAnswerQuery?: string; additionalAccused?: AdditionalAccusedEntry[] },
  templateString: string
): string => {
  if (!Handlebars) {
    console.error("Handlebars no está cargado.");
    return "Error: Handlebars no está disponible.";
  }

  const context: ParagraphDataContext = {
    additionalAccused: data.additionalAccused?.map(acc => ({
      ...acc,
    })) || []
  };
  
  const filterAdditionalAccusedWithPositiveResult = (accusedList: AdditionalAccusedEntry[] | undefined) => {
    return accusedList ? accusedList.filter(acc => acc.queryResult === 'Positivo') : [];
  };

  const localHandlebars = Handlebars.create(); 
  Object.entries(Handlebars.helpers).forEach(([name, helper]) => {
    localHandlebars.registerHelper(name, helper);
  });
  localHandlebars.registerHelper('filterAdditionalAccusedWithPositiveResult', filterAdditionalAccusedWithPositiveResult);


  if (paragraphType === 'WEB_SERVICE') {
  } else if (paragraphType === 'ANI') {
    context.officialAnswerQuery = data.officialAnswerQuery || '';
  }

  try {
    const compiledTemplate = localHandlebars.compile(templateString);
    return compiledTemplate({...context });
  } catch (e) {
    console.error(`Error compilando o ejecutando plantilla Handlebars para Párrafo ${paragraphType}:`, e);
    return `Error al generar párrafo con Handlebars: ${(e as Error).message}`;
  }
};