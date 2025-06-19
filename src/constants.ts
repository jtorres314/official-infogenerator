
export const UI_TEXT = {
  generateReportButton: "Generar Informe",
  copyToClipboardButton: "Copiar al Portapapeles",
  reportCopiedSuccess: "¡Informe copiado al portapapeles!",
  reportCopiedError: "Error al copiar el informe.",
  addOtherOpjButton: "Añadir Nueva OPJ",
  removeOpjButton: "Eliminar",
  otherOrdersTitle: "Órdenes Adicionales",
  uploadPdfLabel: "Cargar PDF de OPJ Principal",
  noFileSelected: "Ningún archivo seleccionado",
  formFields: {
    eventDate: "Fecha de los Hechos",
    eventMunicipality: "Municipio de los Hechos",
    penitentiaryName: "Nombre del Establecimiento Penitenciario",
    eventAddress: "Dirección de los Hechos",
    eventModality: "Modalidad de los Hechos",
    officialRank: "Grado del Funcionario",
    officialReport: "Funcionario Informe Ejecutivo/Noticia Criminal",
    opjNumber: "No. de OPJ",
    opjDate: "Fecha de la OPJ",
    fiscalOffice: "Despacho Fiscal que emite la OPJ",
    officerName: "Nombre del Funcionario (Otra OPJ)",
    accusedName: "Nombre Completo del Indiciado",
    identificationNumber: "Número de Identificación",
    queryResultLabel: "Resultado de Consulta",
    queryResultOptionSelect: "Seleccione...",
    queryResultOptionPositive: "Positivo",
    queryResultOptionNegative: "Negativo",
    officialAnswerQuery: "Funcionario que responde consulta",
  },
  navigation: {
    reports: "Informes",
    paragraphs: "Párrafos",
    dashboard: "Dashboard",
    configurations: "Configuraciones",
    sijin: "SIJIN",
    datt: "DATT",
    inpec: "INPEC",
    webService: "Web Service",
    ani: "ANI",
    sijinTemplate: "Plantilla SIJIN",
    dattTemplate: "Plantilla DATT",
    inpecTemplate: "Plantilla INPEC",
    webServiceParagraphTemplate: "Plantilla Web Service",
    aniParagraphTemplate: "Plantilla ANI",
    sijinDescription: "Generar informes SIJIN.",
    dattDescription: "Generar informes DATT.",
    inpecDescription: "Generar informes INPEC.",
    webServiceParagraphGenerationDescription: "Generar párrafo Web Service.",
    aniParagraphGenerationDescription: "Generar párrafo ANI.",
    sijinTemplateDescription: "Configurar plantilla SIJIN.",
    dattTemplateDescription: "Configurar plantilla DATT.",
    inpecTemplateDescription: "Configurar plantilla INPEC.",
    webServiceParagraphTemplateDescription: "Configurar plantilla Web Service.",
    aniParagraphTemplateDescription: "Configurar plantilla ANI.",
  },
  paragraphGenerator: {
    title: "Desarrollo de Párrafos Estándar",
    titleWebService: "Generación de Párrafo Web Service",
    descriptionWebService: "Generar párrafos estándar para solicitudes de consulta Web Service (Registraduría Nacional del Estado Civil), detallando la información de los indiciados.",
    titleAni: "Generación de Párrafo ANI",
    descriptionAni: "Generar párrafos estándar para solicitudes de consulta ANI (Archivo Nacional de Identificación), detallando la información de los indiciados.",
    consultingOfficerCardTitle: "Información del Funcionario de Consulta",
    accusedDataCardTitle: "Datos del Indiciado",
    additionalAccusedTitle: "Indiciados a Consultar",
    addAdditionalAccusedButton: "Añadir Nuevo Indiciado",
    accusedNamePlaceholder: "Ej: Juan Carlos Pérez Gómez",
    identificationNumberPlaceholder: "Ej: 1234567890",
    generateButton: "Generar Párrafo",
    generatedParagraphLabel: "Párrafo Generado",
    currentParagraphTemplateTitle: "Plantilla de Párrafo Actual",
    paragraphGeneratedLocallySuccess: "Párrafo generado localmente y listo para revisar.",
    viewGeneratedParagraphCardTitle: "Párrafo Web Service Generado",
  },
  errorMessages: {
    unknownError: "Ocurrió un error inesperado.",
    reportGenerationFailed: "La generación del informe falló.",
    paragraphGenerationFailed: "La generación del párrafo falló.",
    templateSaveError: "Error al guardar la plantilla.",
    templateLoadError: "Error al cargar la plantilla personalizada.",
    formCompletionRequiredReport: "Por favor, complete todos los campos del formulario para generar el informe correctamente.",
    formCompletionRequiredParagraph: "Por favor, complete todos los campos del formulario para generar el párrafo correctamente.",
    funcionarioRespondeConsultaRequired: "El campo 'Funcionario que responde consulta' es requerido.",
  },
  toastMessages: {
    reportGeneratedSuccess: "Informe generado exitosamente.",
    reportExportedSuccess: "Informe exportado a Word exitosamente.",
    textCopiedSuccess: "¡Texto copiado al portapapeles!",
    paragraphGeneratedSuccess: "Párrafo generado localmente y listo para revisar.",
  },
  dashboard: {
    title: "Dashboard de Estadísticas",
    sijinReports: "Informes SIJIN",
    dattReports: "Informes DATT",
    inpecReports: "Informes INPEC",
    totalGenerated: "Total Generados",
    noData: "Aún no se han generado informes para mostrar estadísticas.",
  },
  sijinForm: {
    generalCaseInfoTitle: "Información General del Caso",
  },
  reportForms: {
    sijinTitle: "Generación de Informe SIJIN",
    sijinDescription: "Complete los campos para generar un informe estándar de devolución para la SIJIN.",
    dattTitle: "Generación de Informe DATT",
    dattDescription: "Complete los campos para generar un informe estándar de devolución para el DATT.",
    inpecTitle: "Generación de Informe INPEC",
    inpecDescription: "Complete los campos para generar un informe estándar de devolución para el INPEC."
  },
  settings: {
    sijinTemplateFormTitle: "Configuración de Plantilla SIJIN",
    sijinTemplateFormDescription: "Modifique la plantilla Handlebars utilizada para generar los informes SIJIN. Utilice los marcadores de posición listados abajo.",
    dattTemplateFormTitle: "Configuración de Plantilla DATT",
    dattTemplateFormDescription: "Modifique la plantilla Handlebars utilizada para generar los informes DATT. Utilice los marcadores de posición listados abajo.",
    inpecTemplateFormTitle: "Configuración de Plantilla INPEC",
    inpecTemplateFormDescription: "Modifique la plantilla Handlebars utilizada para generar los informes INPEC. Utilice los marcadores de posición listados abajo.",
    webServiceParagraphTemplateFormTitle: "Configuración de Plantilla de Párrafo Web Service",
    webServiceParagraphTemplateFormDescription: "Modifique la plantilla Handlebars para generar párrafos de consulta Web Service. Utilice los marcadores de posición listados.",
    aniParagraphTemplateFormTitle: "Configuración de Plantilla de Párrafo ANI",
    aniParagraphTemplateFormDescription: "Modifique la plantilla Handlebars utilizada para generar los párrafos de consulta ANI. Utilice los marcadores de posición listados.",
    templateLabel: "Plantilla del Informe/Párrafo",
    saveTemplateButton: "Guardar Plantilla",
    templateSavedSuccess: "Plantilla guardada exitosamente.",
    availablePlaceholdersTitle: "Marcadores de Posición Disponibles (Handlebars):",
    uploadTemplateLabel: "Cargar Plantilla desde Archivo .txt",
    uploadTemplateDescription: "Cargue un archivo .txt para usarlo como plantilla.",
    templateReadError: "Error al leer el archivo de plantilla.",
    templateEditorTitle: "Editor de Plantilla",
    uploadCardTitle: "Cargar Plantilla desde Archivo",
    placeholders: {
        eventDate: "{{eventDate}} - Fecha de los hechos (formateada).",
        eventMunicipality: "{{eventMunicipality}} - Municipio de los hechos.",
        eventAddress: "{{eventAddress}} - Dirección de los hechos.",
        eventModality: "{{eventModality}} - Modalidad de los hechos.",
        officialRank: "{{officialRank}} - Grado del funcionario.",
        officialReport: "{{officialReport}} - Funcionario que elaboró el informe.",
        penitentiaryName: "{{penitentiaryName}} - Nombre del Establecimiento Penitenciario (Solo INPEC).",
        otherOpjs: "{{otherOpjs}} - Colección de órdenes adicionales.",
        opjNumber: "{{opjNumber}} - Número de la Orden a Policía Judicial.",
        opjDate: "{{opjDate}} - Fecha de la Orden a Policía Judicial.",
        officerName: "{{officerName}} - Nombre del funcionario a quien se le asignó la OPJ.",
        accusedNamesAni: "{{accusedNamesAni}} - Nombres de los indiciados (formateado para solicitud).",
        folioCountAni: "{{folioCountAni}} - Número de folios de la solicitud inicial.",
        officialAnswerQuery: "{{officialAnswerQuery}} - Funcionario que responde consulta ANI.",
        responseAni: "{{responseAni}} - Párrafo de respuesta detallado.",
        helperIsCartagena: "{{isCartagena eventMunicipality}} - Bloque condicional si el municipio es Cartagena.",
        helperIsCorregimiento: "{{isCorregimiento eventMunicipality}} - Bloque condicional si el municipio es un corregimiento.",
        accusedName: "{{accusedName}} - Nombre completo del indiciado.",
        identificationNumber: "{{identificationNumber}} - Numero de identificación.",
        queryResult: "{{queryResult}} - Resultado de la consulta (Positivo o Negativo).",
        additionalAccused: "{{additionalAccused}} - Colección de indiciados.",
        calculateFolios: "{{calculateFolios}} - Número de folios calculados ."
    },
  },
  generatedReportModal: {
    title: "Informe Generado",
    sijinTitle: "Informe SIJIN Generado",
    dattTitle: "Informe DATT Generado",
    inpecTitle: "Informe INPEC Generado",
    otNumberLabel: "No. de OT (Orden de Trabajo)",
    otNumberPlaceholder: "Ingrese el No. de OT.",
    otNumberValidationError: "Por favor, ingrese un número de OT numérico válido para exportar.",
    exportToWordButton: "Exportar a Word",
    wordExportSuccess: "Informe exportado a Word exitosamente.",
    wordExportError: "Error al exportar el informe a Word.",
    reportTextAreaLabel: "Contenido del Informe Generado"
  }
};

export const REPORT_TEMPLATES = {
  OPJ_SIJIN: `7.1. DEVOLUCIÓN CON OCASIÓN DEL ACUERDO DEL CONSEJO SECCIONAL DE POLICÍA JUDICIAL No. 001 DEL 04 DE JULIO DE 2024:

7.1.1. Se procedió a realizar consulta de la noticia criminal en el Sistema Misional de Información – SPOA, actividad en la que se logró advertir que la misma corresponde a hechos ocurridos el día {{eventDate}}, {{#isCartagena eventMunicipality}}En la ciudad de {{eventMunicipality}}, específicamente en el barrio {{eventAddress}}.{{else}}{{#isCorregimiento eventMunicipality}}En el Corregimiento de {{eventMunicipality}}.{{else}}En el Municipio de {{eventMunicipality}}.{{/isCorregimiento}}{{/isCartagena}} Siendo atendida por miembros de la Policía Nacional que se encontraban en turno de actos urgentes para la realización de la Inspección Técnica a Cadáveres. Por tratarse de un homicidio en la modalidad de {{eventModality}}, tal y como se evidencia en el Informe Ejecutivo firmado por el {{officialRank}} {{officialReport}}.

{{#if otherOpjs}}
Tras verificar la información relacionada con el asunto remitido a esta unidad investigativa, se llevó a cabo una consulta en el apartado Archivo Digital del Sistema Misional de Información – SPOA. Dicha revisión permitió corroborar que, en ocasión anterior, {{#if otherOpjs.[1]}}se emitieron las siguientes órdenes: {{#each otherOpjs as |opj|}}OPJ No. {{opj.opjNumber}} de fecha {{opj.opjDate}} al funcionario {{opj.officerName}}{{#unless @last}}; {{else}}.{{/unless}}{{/each}}{{else}}{{#with otherOpjs.[0] as |opj|}}se emitió la siguiente orden: OPJ No. {{opj.opjNumber}} de fecha {{opj.opjDate}} al funcionario {{opj.officerName}}.{{/with}}{{/if}} Lo que evidencia un trabajo previo desarrollado por la policía judicial de la Policía Nacional.
{{/if}}

Es necesario citar que los delegados de la policía judicial CTI, SIJIN MECAR y SIJIN DEBOL, conforme a lo dispuesto en el Artículo 29, Decisiones del Consejo, del Reglamento contenido en el Acuerdo 01 del 30 de agosto de 2017, presentaron a los miembros del Consejo Seccional de Policía Judicial (presidido por la señora Directora Seccional de Fiscalías) una propuesta de distribución de los despachos y carga misional, la cual quedó aprobada por unanimidad en el Acuerdo del Consejo Seccional de Policía Judicial No. 001 del 04 de julio de 2024, cuyo Artículo 7, 'De los homicidios y las tentativas', establece: “Los grupos investigativos y de criminalística del CTI y SIJIN que apoyen las investigaciones de homicidios dolosos y conductas atentatorias contra la vida y la integridad personal, acuerdan asumir todas las actividades de policía judicial en las etapas de indagación, investigación y juicio”.

Aunado a lo anterior, la Ley 938 de 2004 –Estatuto Orgánico de la Fiscalía General de la Nación– contempla en su Artículo 45, 'El Consejo Nacional de Policía Judicial tiene las siguientes funciones', numeral 1, que corresponde al Consejo Nacional de Policía Judicial: 'analizar las necesidades globales de recursos humanos, técnicos, físicos y financieros requeridos para una eficaz y eficiente investigación e identificación de los responsables de los delitos, y establecer los compromisos que, en este sentido, deberán asumir las distintas entidades que lo conforman'.

En virtud de lo anterior, respetuosamente me permito hacer devolución de la orden de trabajo asignada al suscrito, sugiriendo respetuosamente al despacho fiscal genere una nueva orden a policía judicial con términos amplios, que permitan al investigador del organismo investigativo correspondiente desarrollar las actividades ordenadas o efectuar solicitudes de apoyo investigativo, en los casos en que así se requiera.

Por lo anterior, se rinde el presente informe para su conocimiento y los fines que se estimen pertinentes.
`,
  DATT: `7.1. DEVOLUCIÓN CON OCASIÓN DEL ACUERDO DEL CONSEJO SECCIONAL DE POLICÍA JUDICIAL No. 001 DEL 04 DE JULIO DE 2024:

El objeto del presente informe es dar a conocer al despacho fiscal que, una vez recibida la presente orden de trabajo, por medio de la cual se requirió a la policía judicial la realización de actividades investigativas tendientes a contribuir con el esclarecimiento de los hechos investigados, el suscrito servidor con funciones de policía judicial procedió a realizar las siguientes actividades:

7.1.1. Se procedió a realizar consulta de la noticia criminal en el Sistema Misional de Información – SPOA, actividad en la que se logró advertir que la misma corresponde a hechos ocurridos el día {{eventDate}}, en la ciudad de Cartagena, específicamente en {{eventAddress}}, siendo atendida por miembros del Departamento Administrativo de Tránsito y Transporte, que se encontraban en turno de actos urgentes para la realización de la Inspección Técnica a Cadáveres. Por tratarse de un Accidente de Tránsito, tal y como se evidencia en el Informe Ejecutivo firmado por el {{officialRank}} {{officialReport}}.

Con base en lo anterior y en que los actos urgentes y el impulso de las investigaciones en los casos de homicidios o lesiones ocurridos en accidentes de tránsito serán atendidos por las autoridades de tránsito con funciones de policía judicial de la jurisdicción, respetuosamente me dirijo ante usted con el fin de sugerir la emisión de una nueva orden a la Unidad de Policía Judicial del DATT, que se encuentra en capacidad de asumir la actuación solicitada por el despacho.

Lo anterior, teniendo en cuenta que en las mesas de seguimiento al cumplimiento del Acuerdo del Consejo Seccional de Policía Judicial se adoptó esta medida como una estrategia para lograr el equilibrio de la asignación de la carga misional, que se contempla en los Acuerdos del Consejo Nacional de Policía Judicial y en consideración a las facultades que el artículo 200 CPP otorgó a las autoridades de tránsito dentro de sus competencias.

Es de anotar que el coordinador de la Policía Judicial del DATT es Rafael Miranda, a quien puede contactar a través de la línea celular 300-5902278 y del correo electrónico rafael.miranda@transitocartagena.gov.co, con quien puede coordinar la designación del policía judicial que corresponda para cada caso, o en su defecto verificar directamente los datos en el siguiente listado, que relaciona a quienes cumplen funciones de policía judicial al interior del DATT.

Por lo anterior, se rinde el presente informe para su conocimiento y los fines que se estimen pertinentes.
`,
  INPEC: `7.1. DEVOLUCIÓN CON OCASIÓN DE LAS FUNCIONES DE LA POLICÍA JUDICIAL DEL INPEC DENTRO DE LOS CENTROS CARCELARIOS:

El objeto del presente informe es dar a conocer al despacho fiscal que, una vez recibida la presente orden de trabajo, por medio de la cual se requirió a la policía judicial la realización de actividades investigativas tendientes a contribuir con el esclarecimiento de los hechos investigados, el suscrito servidor con funciones de policía judicial procedió a realizar las siguientes actividades:

7.1.1. Se procedió a realizar consulta de la noticia criminal en el Sistema Misional de Información – SPOA, actividad en la que se logró advertir que la misma corresponde a hechos ocurridos el día {{eventDate}}, en el Municipio de {{eventMunicipality}}, siendo atendida por miembros del INPEC por tratarse de un Homicidio dentro del Instituto Penitenciario {{penitentiaryName}}, tal y como se evidencia en el Informe Ejecutivo firmado por el {{officialRank}} {{officialReport}}.

En la práctica, como funcionarios no pertenecientes al INPEC, hemos encontrado múltiples dificultades para llevar a cabo nuestras actividades dentro de los establecimientos penitenciarios, debido a las restricciones de seguridad, los protocolos internos y la falta de acceso directo a la información y a los internos. Estas limitaciones afectan la eficiencia y el desarrollo adecuado de nuestras funciones, lo que evidencia la necesidad de que estas labores sean realizadas por el personal del INPEC.

El Instituto Nacional Penitenciario y Carcelario (INPEC) cumple funciones de Policía Judicial dentro de los establecimientos de reclusión, de acuerdo con el artículo 112 del Código de Procedimiento Penal (Ley 906 de 2004), que establece que el personal de custodia y vigilancia de los centros penitenciarios podrá adelantar labores de investigación bajo la dirección de la Fiscalía General de la Nación. Asimismo, el artículo 25 de la Ley 65 de 1993 (Código Penitenciario y Carcelario) le otorga al INPEC la responsabilidad exclusiva de la seguridad y el control dentro de los establecimientos de reclusión. En este sentido, el INPEC es la única entidad con competencia para realizar inspecciones, recolectar pruebas, individualizar a presuntos responsables y elaborar informes técnicos sobre hechos ocurridos dentro del penal, siempre en coordinación con las autoridades judiciales competentes. Esto garantiza el cumplimiento de la legalidad en el manejo de investigaciones dentro de los centros carcelarios.

Por lo anterior, se rinde el presente informe para su conocimiento y los fines que se estimen pertinentes.
`,
  DEFAULT_WEB_SERVICE_PARAGRAPH_TEMPLATE: `El suscrito investigador de policía judicial del CTI, para este punto de la orden, informa que se realiza solicitud al Área de Lofoscopia de la Sección de Criminalística de la Seccional Bolívar, con el fin de obtener la Web Service de la Registraduría Nacional del Estado Civil {{#if (gt (arrayLength additionalAccused) 0)}}{{#if (eq (arrayLength additionalAccused) 1)}}   {{#with additionalAccused.0 as |accused|}}del señor {{accused.accusedName}} identificado con {{formatId accused.identificationNumber}}. {{/with}}{{else}}de los señores {{#each additionalAccused as |accused|}}{{accused.accusedName}} identificado con CC No. {{formatId accused.identificationNumber}}{{#unless @last}}, {{else}}. {{/unless}}{{/each}}{{/if}}{{/if}}La solicitud se anexa en un total de {{calculateFolios additionalAccused 5}} folio(s); asimismo, se carga al Sistema Misional de Información SPOA.

De la anterior solicitud se obtiene como respuesta un correo electrónico desde la dirección ctilofcar@fiscalia.gov.co, donde se {{#if (gt (arrayLength additionalAccused) 0)}}{{#if (eq (arrayLength additionalAccused) 1)}}{{#with additionalAccused.[0] as |accused|}}{{#if (eq accused.queryResult "Positivo")}}remite el siguiente documento: "{{idNoDots accused.identificationNumber}}.pdf". El documento "{{idNoDots accused.identificationNumber}}.pdf", contiene Informe sobre Consulta Web a nombre del Señor {{accused.accusedName}}, identificado con CC No. {{formatId accused.identificationNumber}}. {{else if (eq accused.queryResult "Negativo")}} evidencia que los resultados para el Señor {{accused.accusedName}}, identificado con CC No. {{formatId accused.identificationNumber}} fueron negativos. {{/if}}{{/with}}{{else}}remiten los siguientes documentos: {{#with (filterAdditionalAccusedWithPositiveResult additionalAccused) as |positiveAccused|}}{{#if positiveAccused.length}}{{#each positiveAccused as |accused|}}"{{idNoDots accused.identificationNumber}}.pdf"{{#if @last}}. {{else}}{{#if (eq @index (subtract positiveAccused.length 2))}} y {{else}}, {{/if}}{{/if}}{{/each}}{{else}}no se remitieron documentos detallados por resultados no positivos o no especificados.{{/if}}{{/with}}{{#each additionalAccused as |accused|}}{{#if (eq accused.queryResult "Positivo")}}El documento "{{idNoDots accused.identificationNumber}}.pdf", contiene Informe sobre Consulta Web a nombre del Señor {{accused.accusedName}}, identificado con CC No. {{formatId accused.identificationNumber}}{{else if (eq accused.queryResult "Negativo")}} Para el Señor {{accused.accusedName}}, identificado con CC No. {{formatId accused.identificationNumber}}, se evidencia que los resultados fueron negativos{{/if}}{{#unless @last}}; {{else}}. {{/unless}}{{/each}}{{/if}}{{/if}}Los documentos se anexan al presente informe en un total de {{calculateFolios (filterAdditionalAccusedWithPositiveResult additionalAccused) 1}} folio(s), así mismo se cargan al Sistema de Información Misional SPOA.
`,
  DEFAULT_ANI_PARAGRAPH_TEMPLATE: `El suscrito investigador de policía judicial del CTI, para este punto de la orden, informa que se realizó solicitud a la Sección de Análisis Criminal mediante formato FPJ-38 Solicitud de Información Pública, Privada y Semiprivada, con el fin de consultar en el Archivo Nacional de Identificación el cupo numérico que le corresponde{{#if additionalAccused}} a los señores {{join additionalAccused 'accusedName' ', ' ' y '}}.{{else}}.{{/if}} La solicitud se anexa al presente informe en un total de {{calculateFolios additionalAccused 5}} folio(s) útiles y escritos; igualmente, se carga en el Sistema de Información Misional SPOA.

De la anterior solicitud se obtiene como respuesta un correo electrónico desde la dirección cti.sacnivelcentral@fiscalia.gov.co, enviado por parte del funcionario {{officialAnswerQuery}}, en la que manifiesta que remite respuesta a la consulta de la Base de datos, {{#if (gt (arrayLength additionalAccused) 0)}}y esta consiste en {{calculateFolios additionalAccused 1}}archivo(s) PDF así: {{#each additionalAccused as |accused|}}"{{toUpperCase accused.accusedName}}.pdf"{{#if @last}}. {{else}}{{#if (eq @index (subtract additionalAccused.length 2))}} y {{else}}, {{/if}}{{/if}}{{/each}}{{#each additionalAccused as |accused|}}En el archivo "{{toUpperCase accused.accusedName}}.pdf", se observa consulta con el nombre {{accused.accusedName}},  {{#if (eq accused.queryResult "Positivo")}}donde se muestra el resultado de la consulta obteniendo que el NUIP asignado para {{accused.accusedName}} es {{formatId accused.identificationNumber}}{{else if (eq accused.queryResult "Negativo")}}donde se evidencia que el resultado de la consulta arrojo resultados negativos. {{/if}}{{#if @last}}. {{else}}; {{/if}}{{/each}}{{/if}}Las consultas se anexan al presente informe en un total de {{calculateFolios (filterAdditionalAccusedWithPositiveResult additionalAccused) 1}} folio(s), igualmente se carga en el Sistema de Información Misional SPOA.
`
};