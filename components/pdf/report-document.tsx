import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { DerivedResults, TechnicalInputs } from '@/types/calculator';

const styles = StyleSheet.create({
  page: { flexDirection: 'column', backgroundColor: '#FFFFFF', padding: 30 },
  header: { fontSize: 24, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  section: { margin: 10, padding: 10 },
  title: { fontSize: 16, marginBottom: 10, borderBottom: '1 solid #000' },
  text: { fontSize: 12, marginBottom: 5 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  imageContainer: { marginVertical: 15, alignItems: 'center' },
  chartImage: { width: '100%', height: 250, objectFit: 'contain' },
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, fontSize: 10, textAlign: 'center', color: '#666' }
});

interface ReportDocumentProps {
  results: DerivedResults;
  technical: TechnicalInputs;
  pieChartImage?: string;
  barChartImage?: string;
}

export const ReportDocument: React.FC<ReportDocumentProps> = ({ results, technical, pieChartImage, barChartImage }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Battery Storage Calculator Report</Text>
      
      <View style={styles.section}>
        <Text style={styles.title}>System Configuration</Text>
        <View style={styles.row}>
          <Text style={styles.text}>Battery Capacity:</Text>
          <Text style={styles.text}>{technical.currentBatteryCapacityKwh || 0} kWh</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>PV Size:</Text>
          <Text style={styles.text}>{technical.pvSizeKwp || 0} kWp</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>Annual Consumption:</Text>
          <Text style={styles.text}>{technical.annualConsumptionKwh || 0} kWh</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Key Financial Metrics</Text>
        <View style={styles.row}>
          <Text style={styles.text}>Return on Investment (ROI):</Text>
          <Text style={styles.text}>{results.roiPercent.toFixed(2)} %</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>Payback Period:</Text>
          <Text style={styles.text}>{results.paybackYears.toFixed(1)} Years</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>Annual Revenue (Base):</Text>
          <Text style={styles.text}>€{results.totalAnnualRevenue.toFixed(2)}</Text>
        </View>
      </View>

      {pieChartImage && (
        <View style={styles.section}>
          <Text style={styles.title}>Revenue Split Overview</Text>
          <View style={styles.imageContainer}>
            <Image src={pieChartImage} style={styles.chartImage} />
          </View>
        </View>
      )}

      {barChartImage && (
        <View style={styles.section} wrap={false}>
          <Text style={styles.title}>15-Year Cumulative Cash Flow</Text>
          <View style={styles.imageContainer}>
            <Image src={barChartImage} style={styles.chartImage} />
          </View>
        </View>
      )}

      <Text style={styles.footer}>
        Generated on {new Date().toLocaleDateString()}. Financial projections are estimates based on placeholder logic.
      </Text>
    </Page>
  </Document>
);
