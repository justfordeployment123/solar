import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { flexDirection: 'column', backgroundColor: '#ffffff', padding: 40, fontFamily: 'Helvetica' },
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
}

export const ReportDocument: React.FC<ReportDocumentProps> = ({ derivedResults, technical, pieChartImage, barChartImage }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>ROI Projection</Text>
          <Text style={styles.headerSubtitle}>Battery Storage Calculator</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 10, color: '#565656' }}>Date: {new Date().toLocaleDateString()}</Text>
          <Text style={{ fontSize: 10, color: '#565656', fontWeight: 'bold', marginTop: 4 }}>Prepared exclusively for you</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.title}>System Configuration</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Battery Capacity:</Text>
          <Text style={styles.value}>{technical.currentBatteryCapacityKwh || 0} kWh</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>PV Size:</Text>
          <Text style={styles.value}>{technical.pvSizeKwp || 0} kWp</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Annual Consumption:</Text>
          <Text style={styles.value}>{technical.annualConsumptionKwh || 0} kWh</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Financial Metrics</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Return on Investment (NPV):</Text>
          <Text style={styles.highlightValue}>€{((derivedResults.yearlyProjection[14]?.cumulative || 0) + (technical.currentBatteryCapacityKwh || 10) * 1000).toLocaleString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Break-Even Point:</Text>
          <Text style={styles.value}>{Math.ceil(derivedResults.paybackYears) ? `Year ${Math.ceil(derivedResults.paybackYears)}` : 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Average Yearly Revenue:</Text>
          <Text style={styles.value}>€{Math.round(derivedResults.totalAnnualRevenue).toLocaleString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Autarky Rate:</Text>
          <Text style={styles.value}>{75} %</Text>
        </View>
      </View>

      {pieChartImage && (
        <View style={styles.section} wrap={false}>
          <Text style={styles.title}>Revenue Split Overview</Text>
          <View style={styles.imageContainer}>
            <Image src={pieChartImage} style={styles.chartImage} />
          </View>
        </View>
      )}

      {barChartImage && (
        <View style={styles.section} wrap={false}>
          <Text style={styles.title}>Lifetime Cashflow Projection</Text>
          <View style={styles.imageContainer}>
            <Image src={barChartImage} style={styles.chartImage} />
          </View>
        </View>
      )}

      <Text style={styles.footer}>
        Financial projections are estimates based on the configured system logic. Actual results may vary depending on local regulations, market prices, and consumption behavior.
      </Text>
    </Page>
  </Document>
);
