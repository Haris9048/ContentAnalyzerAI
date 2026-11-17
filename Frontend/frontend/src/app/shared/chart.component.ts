import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import Chart from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  standalone: true,
  template: `
    <div class="chart-container">
      <canvas #canvas></canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      position: relative;
      width: 100%;
      height: 280px;
    }
  `]
})
export class ChartComponent
  implements AfterViewInit, OnChanges, OnDestroy {

  @Input() labels: string[] = [];
  @Input() values: number[] = [];
  @Input() label = 'Views';
  @Input() type: 'bar' | 'line' = 'bar';

  @ViewChild('canvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  chart?: Chart;

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart && (
      changes['labels'] ||
      changes['values'] ||
      changes['type']
    )) {
      this.chart.destroy();
      this.createChart();
    }
  }

  createChart(): void {
    if (!this.canvas) return;

    this.chart = new Chart(
      this.canvas.nativeElement,
      {
        type: this.type,
        data: {
          labels: this.labels,
          datasets: [{
            label: this.label,
            data: this.values,
            borderWidth: 2,
            borderRadius: 6,
            tension: 0.35,
            backgroundColor: 'rgba(99, 102, 241, 0.65)',
            borderColor: 'rgb(99, 102, 241)',
            fill: this.type === 'line'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}