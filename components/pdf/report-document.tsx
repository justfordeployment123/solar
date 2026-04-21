import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { flexDirection: 'column', backgroundColor: '#ffffff', paddingTop: 140, paddingBottom: 85, paddingHorizontal: 40, fontFamily: 'Helvetica' },
  background: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', zIndex: -1 },
  contentWrapper: { zIndex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, paddingBottom: 20, borderBottomWidth: 2, borderBottomColor: '#dfdfdf' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#363636', letterSpacing: -1 },
  headerSubtitle: { fontSize: 10, color: '#565656', textTransform: 'uppercase', letterSpacing: 2 },
  section: { backgroundColor: '#ffffff', borderRadius: 16, padding: 24, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10 },
  title: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5, color: '#565656', marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#dfdfdf' },
  label: { fontSize: 11, color: '#565656', fontWeight: 'medium' },
  value: { fontSize: 11, color: '#363636', fontWeight: 'bold' },
  highlightValue: { fontSize: 14, color: '#dfdfdf', fontWeight: 'bold' },
  imageContainer: { marginTop: 20, alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 12, padding: 15 },
  chartImage: { width: '100%', height: 260, objectFit: 'contain' },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 9, textAlign: 'center', color: '#565656', borderTopWidth: 1, borderTopColor: '#dfdfdf', paddingTop: 15 }
});

interface ReportDocumentProps {
  derivedResults: any;
  technical: any;
  pieChartImage?: string;
  barChartImage?: string;
  letterheadImage?: string;
}

export const ReportDocument: React.FC<ReportDocumentProps> = ({ derivedResults, technical, pieChartImage, barChartImage, letterheadImage }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {letterheadImage && (
        <Image src={letterheadImage} style={styles.background} fixed={true} />
      )}
      
      <View style={styles.contentWrapper}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>ROI-Prognose</Text>
            <Text style={styles.headerSubtitle}>Batteriespeicher-Rechner</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 10, color: '#565656' }}>Datum: {new Date().toLocaleDateString()}</Text>
            <Text style={{ fontSize: 10, color: '#565656', fontWeight: 'bold', marginTop: 4 }}>Exklusiv für Sie erstellt</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.title}>Systemkonfiguration</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Batteriekapazität:</Text>
            <Text style={styles.value}>{technical.currentBatteryCapacityKwh || 0} kWh</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>PV-Größe:</Text>
            <Text style={styles.value}>{technical.pvSizeKwp || 0} kWp</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Jahresverbrauch:</Text>
            <Text style={styles.value}>{technical.annualConsumptionKwh || 0} kWh</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Finanzielle Kennzahlen</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Kapitalrendite (NPV):</Text>
            <Text style={styles.highlightValue}>€{((derivedResults.yearlyProjection[14]?.cumulative || 0) + (technical.currentBatteryCapacityKwh || 10) * 1000).toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Amortisationszeitpunkt:</Text>
            <Text style={styles.value}>{Math.ceil(derivedResults.paybackYears) ? `Jahr ${Math.ceil(derivedResults.paybackYears)}` : 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Durchschn. Jahresertrag:</Text>
            <Text style={styles.value}>€{Math.round(derivedResults.totalAnnualRevenue).toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Autarkiegrad:</Text>
            <Text style={styles.value}>{75} %</Text>
          </View>
        </View>

        {pieChartImage && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.title}>Einnahmen-Aufschlüsselung</Text>
            <View style={styles.imageContainer}>
              <Image src={pieChartImage} style={styles.chartImage} />
            </View>
          </View>
        )}

        {barChartImage && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.title}>Cashflow-Prognose über die Lebensdauer</Text>
            <View style={styles.imageContainer}>
              <Image src={barChartImage} style={styles.chartImage} />
            </View>
          </View>
        )}
      </View>

      <Text style={styles.footer} fixed={true}>
        Finanzprognosen sind Schätzungen, die auf der konfigurierten Systemlogik basieren. Die tatsächlichen Ergebnisse können je nach lokalen Vorschriften, Marktpreisen und Verbrauchsverhalten variieren.
      </Text>
    </Page>
  </Document>
);
