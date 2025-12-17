import {AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {CommonModule, DecimalPipe, PercentPipe} from '@angular/common';
import * as echarts from 'echarts/core';
import {GaugeChart} from 'echarts/charts';
import {CanvasRenderer} from 'echarts/renderers';

echarts.use([GaugeChart, CanvasRenderer]);

@Component({
  selector: 'app-timeframe-breakdown',
  standalone: true,
  imports: [CommonModule, DecimalPipe, PercentPipe],
  templateUrl: './timeframe-breakdown.component.html',
  styleUrls: ['./timeframe-breakdown.component.scss']
})
export class TimeframeBreakdownComponent implements AfterViewInit, OnChanges {
  @Input() score4h: number = 0;
  @Input() confidence4h: number = 0;
  @Input() lastUpdate4h?: Date;

  @Input() score1h: number = 0;
  @Input() confidence1h: number = 0;
  @Input() lastUpdate1h?: Date;

  @Input() score30m: number = 0;
  @Input() confidence30m: number = 0;
  @Input() lastUpdate30m?: Date;

  @ViewChild('gauge4h', {static: false}) gauge4hRef?: ElementRef;
  @ViewChild('gauge1h', {static: false}) gauge1hRef?: ElementRef;
  @ViewChild('gauge30m', {static: false}) gauge30mRef?: ElementRef;

  private chart4h?: echarts.ECharts;
  private chart1h?: echarts.ECharts;
  private chart30m?: echarts.ECharts;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initCharts();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['score4h'] || changes['score1h'] || changes['score30m']) {
      this.updateCharts();
    }
  }

  getScoreColor(score: number): string {
    if (score < 40) return '#FF3D71';
    if (score < 60) return '#FFA726';
    return '#00C853';
  }

  formatLastUpdate(date?: Date): string {
    if (!date) return 'N/A';
    const now = new Date();
    const updateDate = new Date(date);
    const diffMs = now.getTime() - updateDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }

  private initCharts(): void {
    if (this.gauge4hRef) {
      this.chart4h = echarts.init(this.gauge4hRef.nativeElement);
      this.updateGauge(this.chart4h, this.score4h);
    }

    if (this.gauge1hRef) {
      this.chart1h = echarts.init(this.gauge1hRef.nativeElement);
      this.updateGauge(this.chart1h, this.score1h);
    }

    if (this.gauge30mRef) {
      this.chart30m = echarts.init(this.gauge30mRef.nativeElement);
      this.updateGauge(this.chart30m, this.score30m);
    }
  }

  private updateCharts(): void {
    if (this.chart4h) this.updateGauge(this.chart4h, this.score4h);
    if (this.chart1h) this.updateGauge(this.chart1h, this.score1h);
    if (this.chart30m) this.updateGauge(this.chart30m, this.score30m);
  }

  private updateGauge(chart: echarts.ECharts, score: number): void {
    const option: echarts.EChartsCoreOption = {
      series: [{
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        radius: '100%',
        axisLine: {
          lineStyle: {
            width: 8,
            color: [
              [0.4, '#FF3D71'],   // Red
              [0.6, '#FFA726'],   // Orange
              [1, '#00C853']      // Green
            ]
          }
        },
        pointer: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        detail: {
          show: false
        },
        data: [{value: score}]
      }]
    };

    chart.setOption(option);
  }
}
