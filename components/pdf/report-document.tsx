import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

const LABELS = {
  headerTitle: "Wirtschaftlichkeitsprognose",
  headerSubtitle: "Batteriespeicher-Rechner",
  dateLabel: "Datum:",
  preparedFor: "Exklusiv für Sie erstellt durch:",
  systemConfigTitle: "Technische Systemkonfiguration",
  batteryCapacity: "Installierte Batteriekapazität:",
  pvSize: "Installierte PV-Leistung:",
  annualConsumption: "Bisheriger Jahresverbrauch:",
  financialMetricsTitle: "Finanzielle Kennzahlen & Wirtschaftlichkeit",
  roi: "Kapitalrendite (NPV):",
  breakEven: "Amortisationszeitpunkt (Break-Even):",
  avgAnnualRevenue: "Durchschnittlicher Jahresertrag:",
  autarkyRate: "Autarkiegrad (Schätzung):",
  revenueSplitTitle: "Detaillierte Einnahmen-Aufschlüsselung",
  cashflowTitle: "Cashflow-Prognose über die Lebensdauer (15 Jahre)",
  disclaimer: "Wichtiger Hinweis: Finanzprognosen sind mathematische Schätzungen, die auf der konfigurierten Systemlogik basieren. Die tatsächlichen Ergebnisse können je nach lokalen Netzvorschriften, Spotmarktpreisen und realem Verbrauchsverhalten variieren. Alle Angaben ohne Gewähr.",
  yearLabel: "Jahr",
  na: "N/A",
  detailsTitle: "Ertragsquellen Detailansicht (Erstes Betriebsjahr)",
  epexArbitrage: "Intraday-Handel (EPEX Spot):",
  prl: "Primärregelleistung (PRL):",
  srlAfrr: "Sekundärregelleistung (aFRR):",
  selfConsumption: "Eigennutzung & Einsparungen:",
  peakShaving: "Lastspitzenkappung (Peak Shaving):"
};

const styles = StyleSheet.create({
  page: { flexDirection: 'column', backgroundColor: '#ffffff', paddingTop: 90, paddingBottom: 85, paddingHorizontal: 40, fontFamily: 'Helvetica' },
  background: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', zIndex: -1 },
  contentWrapper: { zIndex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 30, paddingBottom: 15, borderBottomWidth: 2, borderBottomColor: '#363636' },
  headerLeft: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#363636', letterSpacing: -0.5, marginBottom: 4 },
  headerSubtitle: { fontSize: 10, color: '#565656', textTransform: 'uppercase', letterSpacing: 1.5 },
  headerRight: { alignItems: 'flex-end', justifyContent: 'flex-start', maxWidth: 200 },
  logoImage: { height: 45, width: 150, objectFit: 'contain', marginBottom: 8 },
  companyName: { fontSize: 14, fontWeight: 'bold', color: '#1e293b', marginBottom: 4, textAlign: 'right' },
  headerMeta: { fontSize: 9, color: '#565656', marginTop: 2, textAlign: 'right' },
  headerMetaBold: { fontSize: 9, color: '#363636', fontWeight: 'bold', marginTop: 8, textAlign: 'right' },
  
  gridContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  gridColumn: { width: '48%', backgroundColor: '#f8fafc', borderRadius: 8, padding: 16, borderLeftWidth: 3, borderLeftColor: '#e12029' },
  
  title: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.2, color: '#1e293b', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#cbd5e1', paddingBottom: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  label: { fontSize: 9, color: '#64748b' },
  value: { fontSize: 9, color: '#0f172a', fontWeight: 'bold' },
  highlightValue: { fontSize: 11, color: '#e12029', fontWeight: 'bold' },
  
  fullWidthSection: { backgroundColor: '#f8fafc', borderRadius: 8, padding: 16, marginBottom: 20, borderLeftWidth: 3, borderLeftColor: '#475569' },
  
  chartContainer: { marginTop: 10, alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 6, padding: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  chartImage: { width: '100%', height: 220, objectFit: 'contain' },
  chartCaption: { fontSize: 9, color: '#64748b', marginTop: 8, fontStyle: 'italic', lineHeight: 1.4 },
  
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 8, textAlign: 'justify', color: '#94a3b8', borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 10, lineHeight: 1.4 }
});

interface ReportDocumentProps {
  derivedResults: any;
  technical: any;
  pieChartImage?: string;
  barChartImage?: string;
  letterheadImage?: string;
  activeLogo?: string;
  companyName?: string;
}

export const ReportDocument: React.FC<ReportDocumentProps> = ({ derivedResults, technical, pieChartImage, barChartImage, letterheadImage, activeLogo, companyName }) => {
  const formatCurrency = (val: number) => `€${Math.round(val).toLocaleString('de-DE')}`;
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {letterheadImage && (
          <Image src={letterheadImage} style={styles.background} fixed={true} />
        )}
        
        <View style={styles.contentWrapper}>
          <View style={styles.header} fixed>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>{LABELS.headerTitle}</Text>
              <Text style={styles.headerSubtitle}>{LABELS.headerSubtitle}</Text>
              <Text style={{ ...styles.headerMeta, marginTop: 10, textAlign: 'left' }}>
                {LABELS.dateLabel} {new Date().toLocaleDateString('de-DE')}
              </Text>
            </View>
            <View style={styles.headerRight}>
              {activeLogo && (
                <Image src={activeLogo} style={styles.logoImage} />
              )}
              {companyName && (
                <Text style={styles.companyName}>{companyName}</Text>
              )}
              <Text style={styles.headerMetaBold}>{LABELS.preparedFor}</Text>
              <Text style={styles.headerMeta}>{companyName || "My Solar GmbH"}</Text>
            </View>
          </View>
          
          <View style={styles.gridContainer}>
            <View style={styles.gridColumn}>
              <Text style={styles.title}>{LABELS.systemConfigTitle}</Text>
              <View style={styles.row}>
                <Text style={styles.label}>{LABELS.batteryCapacity}</Text>
                <Text style={styles.value}>{technical.currentBatteryCapacityKwh?.toLocaleString('de-DE') || 0} kWh</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{LABELS.pvSize}</Text>
                <Text style={styles.value}>{technical.pvSizeKwp?.toLocaleString('de-DE') || 0} kWp</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{LABELS.annualConsumption}</Text>
                <Text style={styles.value}>{technical.annualConsumptionKwh?.toLocaleString('de-DE') || 0} kWh</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Batterie-Degradation (Jährlich):</Text>
                <Text style={styles.value}>2.50 %</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Hardware-Ersatzzyklus:</Text>
                <Text style={styles.value}>Jahr 10</Text>
              </View>
            </View>

            <View style={styles.gridColumn}>
              <Text style={styles.title}>{LABELS.financialMetricsTitle}</Text>
              <View style={styles.row}>
                <Text style={styles.label}>{LABELS.roi}</Text>
                <Text style={styles.highlightValue}>
                  {formatCurrency((derivedResults.yearlyProjection[14]?.cumulative || 0) + (technical.currentBatteryCapacityKwh || 10) * 1000)}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{LABELS.breakEven}</Text>
                <Text style={styles.value}>{Math.ceil(derivedResults.paybackYears) ? `${LABELS.yearLabel} ${Math.ceil(derivedResults.paybackYears)}` : LABELS.na}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{LABELS.avgAnnualRevenue}</Text>
                <Text style={styles.value}>{formatCurrency(derivedResults.totalAnnualRevenue)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{LABELS.autarkyRate}</Text>
                <Text style={styles.value}>{75} %</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Zusatzerträge (VPP):</Text>
                <Text style={styles.value}>Aktiv</Text>
              </View>
            </View>
          </View>

          <View style={styles.fullWidthSection}>
            <Text style={styles.title}>{LABELS.detailsTitle}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <View style={{ width: '48%' }}>
                <View style={styles.row}>
                  <Text style={styles.label}>{LABELS.prl}</Text>
                  <Text style={styles.value}>{formatCurrency(derivedResults.annualRevenueByStream.prl || 0)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>{LABELS.srlAfrr}</Text>
                  <Text style={styles.value}>{formatCurrency(derivedResults.annualRevenueByStream.srlAfrr || 0)}</Text>
                </View>
              </View>
              <View style={{ width: '48%' }}>
                <View style={styles.row}>
                  <Text style={styles.label}>{LABELS.epexArbitrage}</Text>
                  <Text style={styles.value}>{formatCurrency(derivedResults.annualRevenueByStream.epexArbitrage || 0)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>{LABELS.selfConsumption}</Text>
                  <Text style={styles.value}>{formatCurrency(derivedResults.annualRevenueByStream.selfConsumption || 0)}</Text>
                </View>
              </View>
            </View>
          </View>

          {pieChartImage && (
            <View style={{ marginBottom: 20 }} wrap={false}>
              <Text style={styles.title}>{LABELS.revenueSplitTitle}</Text>
              <View style={styles.chartContainer}>
                <Image src={pieChartImage} style={styles.chartImage} />
              </View>
              <Text style={styles.chartCaption}>
                Diese Grafik illustriert die prognostizierte Ertragsverteilung. Sie zeigt im Detail, wie sich die unterschiedlichen Einnahmenquellen (wie Intraday-Handel, PRL und Eigenverbrauch) prozentual auf Ihre Gesamteinnahmenstruktur auswirken.
              </Text>
            </View>
          )}

          {barChartImage && (
            <View wrap={false}>
              <Text style={styles.title}>{LABELS.cashflowTitle}</Text>
              <View style={styles.chartContainer}>
                <Image src={barChartImage} style={styles.chartImage} />
              </View>
              <Text style={styles.chartCaption}>
                Dieses Diagramm veranschaulicht die kumulierten Cashflows über die erwartete Lebensdauer der Anlage von 15 Jahren, einschließlich der Amortisation der anfänglichen Batterieinvestition. So sehen Sie transparent, ab wann Ihre Batterie Gewinn erwirtschaftet.
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.footer} fixed={true}>
          {LABELS.disclaimer}
        </Text>
      </Page>
    </Document>
  );
};
