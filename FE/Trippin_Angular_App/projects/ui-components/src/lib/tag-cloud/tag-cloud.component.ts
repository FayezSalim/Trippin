import { CommonModule } from '@angular/common';
import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    ElementRef,
    AfterViewInit,
    HostListener,
    NgZone
} from '@angular/core';
import { Tag, TagData } from './models/tag';


@Component({
    selector: 'trippin-tag-cloud',
    templateUrl: './tag-cloud.component.html',
    styleUrls: ['./tag-cloud.component.css'],
    imports: [CommonModule]
})
export class TagCloudComponent implements AfterViewInit {
    @Input() tags: TagData[] = [];
    @Output() selected = new EventEmitter<TagData[]>();

    @ViewChild('cloudArea', { static: false }) cloudAreaRef!: ElementRef<HTMLDivElement>;

    visibleTags: Tag[] = [];
    dismissedTags: Tag[] = [];
    selectedTags: Tag[] = [];

    cloudAreaWidth = 0;
    cloudAreaHeight = 0;

    readonly estimatedTagWidth = 140; // px
    readonly estimatedTagHeight = 40; // px

    constructor(private zone: NgZone) { }

    ngAfterViewInit() {
        // Wait for the view to stabilize to get correct heights
        // this.zone.onStable.asObservable().subscribe(() => {
        //     this.measureAreas();
        //     this.resetTags();
        // });
        setTimeout(() => {
            this.measureAreas();
            this.resetTags();
        });
    }

    @HostListener('window:resize')
    onResize() {
        this.measureAreas();
        this.resetTags();
    }

    measureAreas() {
        if (this.cloudAreaRef) {
            const rect = this.cloudAreaRef.nativeElement.getBoundingClientRect();
            this.cloudAreaWidth = rect.width;
            this.cloudAreaHeight = rect.height;
        }
    }

    getTagsPerRow(): number {
        return Math.max(1, Math.floor(this.cloudAreaWidth / this.estimatedTagWidth));
    }

    getAvailableRows(): number {
        return Math.max(1, Math.floor(this.cloudAreaHeight / this.estimatedTagHeight));
    }

    // Returns all tags that can be shown (not selected, not dismissed, not already visible)
    getPool(): Tag[] {
        const selectedLabels = new Set(this.selectedTags.map(t => t.tagData.name));
        const visibleLabels = new Set(this.visibleTags.map(t => t.tagData.name));
        const dismissedLabels = new Set(this.dismissedTags.map(t => t.tagData.name));

        return this.tags
            .filter(
                a =>
                    !selectedLabels.has(a.name) &&
                    !visibleLabels.has(a.name) &&
                    !dismissedLabels.has(a.name)
            )
            .map((a, i) => ({
                tagData: a,
                isVisible: false,
                key: `${a.name}-${i}`
            }));
    }

    // Place tags in a grid, no adjacent in row/col, with randomness
    placeTags() {
        const tagsPerRow = this.getTagsPerRow();
        const rows = this.getAvailableRows();
        const cellWidth = this.cloudAreaWidth / tagsPerRow;
        const cellHeight = this.cloudAreaHeight / rows;

        // Prepare grid and fill with randomness and adjacency rule
        const filled: boolean[][] = Array.from({ length: rows }, () =>
            Array(tagsPerRow).fill(false)
        );
        const positions: { row: number; col: number }[] = [];
        // Generate all possible positions
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < tagsPerRow; col++) {
                positions.push({ row, col });
            }
        }
        // Shuffle positions for randomness
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }

        const pool = [...this.getPool(), ...this.dismissedTags];
        const newVisibleTags: Tag[] = [];
        let poolIdx = 0;
        for (const pos of positions) {
            if (poolIdx >= pool.length) break;
            const { row, col } = pos;
            // No adjacent in row/col
            const leftFilled = col > 0 && filled[row][col - 1];
            const aboveFilled = row > 0 && filled[row - 1][col];
            if (!leftFilled && !aboveFilled) {
                const tag = { ...pool[poolIdx] };
                tag.top = `${row * cellHeight + (cellHeight - this.estimatedTagHeight) / 2}px`;
                tag.left = `${col * cellWidth + (cellWidth - this.estimatedTagWidth) / 2}px`;
                tag.isVisible = true;
                newVisibleTags.push(tag);
                filled[row][col] = true;
                poolIdx++;
            }
        }
        this.visibleTags = newVisibleTags;
        // Remove any dismissed tags that are now visible
        this.dismissedTags = this.dismissedTags.filter(
            t => !this.visibleTags.some(vt => vt.tagData.name === t.tagData.name)
        );
    }

    resetTags() {
        this.measureAreas();
        this.placeTags();
    }

    // Called when a tag is selected (clicked)
    selectTag(tag: Tag) {
        this.visibleTags = this.visibleTags.filter(t => t.tagData.name !== tag.tagData.name);
        this.selectedTags.push(tag);

        // Remove tags in the last row if the number of rows decreased
        setTimeout(() => {
            this.measureAreas();
            this.placeTags();
            this.selected.emit(this.selectedTags.map(x => x.tagData));
        });
    }

    // Called when a tag is dismissed (close button)
    dismissTag(tag: Tag) {
        this.visibleTags = this.visibleTags.filter(t => t.tagData.name !== tag.tagData.name);
        this.dismissedTags.push(tag); // FIFO: add to end
        this.placeTags();
    }

    // Called when a selected tag is removed from the bottom area
    removeSelectedTag(tag: Tag) {
        this.selectedTags = this.selectedTags.filter(t => t.tagData.name !== tag.tagData.name);
        this.placeTags();
        this.selected.emit(this.selectedTags.map(x => x.tagData));
    }
}