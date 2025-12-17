import {AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import * as echarts from 'echarts/core';
import {BarChart} from 'echarts/charts';
import {GridComponent, TooltipComponent} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';

echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer]);

export interface StrategyScore {
  score: number;
  confidence: number;
}

@Component({
  selector: 'app-strategy-breakdown-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './strategy-breakdown-chart.component.html',
  styleUrls: ['./strategy-breakdown-chart.component.scss']
})
export class StrategyBreakdownChartComponent implements AfterViewInit, OnChanges {
  @Input() breakdown!: Record<string, StrategyScore>;
  @Input() height: string = '300px';

  @ViewChild('chartContainer', {static: false}) chartContainer?: ElementRef;

  private chart?: echarts.ECharts;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initChart();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['breakdown'] && this.chart) {
      this.updateChart();
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  private initChart(): void {
    if (!this.chartContainer) return;

    this.chart = echarts.init(this.chartContainer.nativeElement);
    this.updateChart();

    // Responsive resize
    window.addEventListener('resize', () => {
      this.chart?.resize();
    });
  }

  private updateChart(): void {
    if (!this.chart || !this.breakdown) return;

    const strategyNames = Object.keys(this.breakdown);
    const strategyData = strategyNames.map(name => ({
      name,
      value: this.breakdown[name].score,
      confidence: this.breakdown[name].confidence
    }));

    const option: echarts.EChartsCoreOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        backgroundColor: 'rgba(30, 30, 30, 0.95)',
        borderColor: 'rgba(0, 168, 255, 0.5)',
        borderWidth: 1,
        textStyle: {
          color: '#FFFFFF',
          fontSize: 12
        },
        formatter: (params: any) => {
          const data = params[0];
          const strategyName = data.name;
          const score = data.value;
          const confidence = this.breakdown[strategyName].confidence;

          return `
            <div style="padding: 4px;">
              <div style="font-weight: 600; margin-bottom: 4px;">${strategyName}</div>
              <div style="color: ${score >= 0 ? '#00C853' : '#FF3D71'};">
                Score: ${score >= 0 ? '+' : ''}${score.toFixed(1)}
              </div>
              <div style="color: #9AADBC;">
                Confidence: ${(confidence * 100).toFixed(0)}%
              </div>
            </div>
          `;
        }
      },
      grid: {
        left: '25%',
        right: '10%',
        top: '10%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          color: '#9AADBC',
          fontSize: 11
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.05)'
          }
        }
      },
      yAxis: {
        type: 'category',
        data: strategyNames,
        axisLabel: {
          color: '#9AADBC',
          fontSize: 11,
          formatter: (value: string) => {
            // Abbreviate long strategy names
            return value.length > 15 ? value.substring(0, 12) + '...' : value;
          }
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      },
      series: [{
        type: 'bar',
        data: strategyData.map(item => ({
          value: item.value,
          itemStyle: {
            color: item.value >= 0 ? '#00C853' : '#FF3D71',
            borderRadius: [0, 4, 4, 0]
          }
        })),
        barWidth: '60%',
        label: {
          show: true,
          position: 'right',
          formatter: (params: any) => {
            const value = params.value;
            return value >= 0 ? `+${value.toFixed(1)}` : value.toFixed(1);
          },
          color: '#FFFFFF',
          fontSize: 11,
          fontWeight: 600
        }
      }]
    };

    this.chart.setOption(option);
  }
}
