import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NbCardModule, NbPopoverModule} from '@nebular/theme';
import * as echarts from 'echarts/core';
import {EChartsCoreOption} from 'echarts/core';
import {GaugeChart} from 'echarts/charts';
import {CanvasRenderer} from 'echarts/renderers';

echarts.use([GaugeChart, CanvasRenderer]);

export interface StrategyScore {
  score: number;
  confidence: number;
}

@Component({
  selector: 'app-score-display',
  standalone: true,
  imports: [CommonModule, NbPopoverModule, NbCardModule],
  templateUrl: './score-display.component.html',
  styleUrls: ['./score-display.component.scss']
})
export class ScoreDisplayComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() score: number = 0;
  @Input() confidence: number = 0;
  @Input() timeframe?: string;
  @Input() showBreakdown: boolean = false;
  @Input() breakdown?: Record<string, StrategyScore>;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() animated: boolean = true;
  @Input() showSparkline: boolean = false;
  @Input() sparklineData?: number[];

  @ViewChild('gaugeContainer', {static: false}) gaugeContainer?: ElementRef;
  @ViewChild('sparklineContainer', {static: false}) sparklineContainer?: ElementRef;
  breakdownEntries: Array<{ key: string; value: StrategyScore }> = [];
  private gaugeChart?: echarts.ECharts;
  private sparklineChart?: echarts.ECharts;

  get confidencePercent(): string {
    return `${Math.round(this.confidence * 100)}%`;
  }

  get scoreColor(): string {
    if (this.score < 40) return '#FF3D71';
    if (this.score < 60) return '#FFA726';
    return '#00C853';
  }

  ngOnInit(): void {
    if (this.breakdown) {
      this.breakdownEntries = Object.entries(this.breakdown).map(([key, value]) => ({key, value}));
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['score'] && this.gaugeChart) {
      this.updateGauge();
    }

    if (changes['sparklineData'] && this.sparklineChart) {
      this.updateSparkline();
    }

    if (changes['breakdown']) {
      this.breakdownEntries = this.breakdown
        ? Object.entries(this.breakdown).map(([key, value]) => ({key, value}))
        : [];
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initGauge();
      if (this.showSparkline && this.sparklineData) {
        this.initSparkline();
      }
    });
  }

  private initGauge(): void {
    if (!this.gaugeContainer) return;

    this.gaugeChart = echarts.init(this.gaugeContainer.nativeElement);
    this.updateGauge();
  }

  private updateGauge(): void {
    if (!this.gaugeChart) return;

    const sizeConfig = this.getSizeConfig();

    const option: EChartsCoreOption = {
      series: [{
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 10,
        radius: '100%',
        axisLine: {
          lineStyle: {
            width: sizeConfig.gaugeWidth,
            color: [
              [0.4, '#FF3D71'],   // Red zone (0-40)
              [0.6, '#FFA726'],   // Orange zone (40-60)
              [1, '#00C853']      // Green zone (60-100)
            ]
          }
        },
        pointer: {
          itemStyle: {
            color: '#00A8FF'
          },
          length: '70%',
          width: 6
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
          valueAnimation: this.animated,
          formatter: '{value}',
          fontSize: sizeConfig.fontSize,
          color: '#FFFFFF',
          offsetCenter: [0, '20%']
        },
        data: [{
          value: this.score,
          name: this.timeframe || ''
        }]
      }]
    };

    this.gaugeChart.setOption(option);
  }

  private initSparkline(): void {
    if (!this.sparklineContainer || !this.sparklineData) return;

    this.sparklineChart = echarts.init(this.sparklineContainer.nativeElement);
    this.updateSparkline();
  }

  private updateSparkline(): void {
    if (!this.sparklineChart || !this.sparklineData) return;

    const option: EChartsCoreOption = {
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      xAxis: {
        type: 'category',
        show: false,
        data: this.sparklineData.map((_, i) => i.toString())
      },
      yAxis: {
        type: 'value',
        show: false,
        min: 0,
        max: 100
      },
      series: [{
        type: 'line',
        data: this.sparklineData,
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: '#00A8FF',
          width: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(0, 168, 255, 0.3)'
          }, {
            offset: 1,
            color: 'rgba(0, 168, 255, 0.05)'
          }])
        }
      }]
    };

    this.sparklineChart.setOption(option);
  }

  private getSizeConfig() {
    const configs = {
      small: {gaugeWidth: 12, fontSize: 18},
      medium: {gaugeWidth: 15, fontSize: 24},
      large: {gaugeWidth: 18, fontSize: 32}
    };
    return configs[this.size];
  }
}
