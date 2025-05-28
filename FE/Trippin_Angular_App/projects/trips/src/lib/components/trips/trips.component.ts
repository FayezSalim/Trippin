import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'trippin-trips',
  imports: [CommonModule, FormsModule],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('400ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class TripsComponent {
  showBasics = false;
  swipeLeft = false;
  showActivities = false;
  swipeLeftBasics = false;

  // All activities
  allActivities = [
    { label: 'Hiking', icon: '🥾' },
    { label: 'Museum', icon: '🏛️' },
    { label: 'Beach', icon: '🏖️' },
    { label: 'Food', icon: '🍽️' },
    { label: 'Shopping', icon: '🛍️' },
    { label: 'Nightlife', icon: '🎉' },
    { label: 'Cycling', icon: '🚴' },
    { label: 'Photography', icon: '📷' },
    { label: 'Art', icon: '🎨' },
    { label: 'Music', icon: '🎵' },
    { label: 'Nature', icon: '🌲' },
    { label: 'History', icon: '📜' }
  ];

  // Fixed non-overlapping positions
  tagPositions = [
    { top: '10%', left: '15%' },
    { top: '30%', left: '60%' },
    { top: '60%', left: '25%' },
    { top: '50%', left: '70%' },
    { top: '75%', left: '40%' },
    { top: '20%', left: '80%' },
    { top: '65%', left: '10%' },
    { top: '80%', left: '60%' }
  ];

  visibleTags: any[] = [];
  hiddenTags: any[] = [];
  selectedTags: any[] = [];
  tagsPerPage = 4;

  trip = {
    city: '',
    startDate: '',
    endDate: '',
    budget: null
  };

  ngOnInit() {
    this.resetActivities();
  }

  resetActivities() {
    // Clone and shuffle activities
    const shuffled = [...this.allActivities].sort(() => Math.random() - 0.5);
    this.hiddenTags = shuffled.map((tag, i) => ({
      ...tag,
      ...this.tagPositions[i % this.tagPositions.length],
      key: `${tag.label}-${i}`,
      visible: false
    }));
    this.selectedTags = [];
    this.visibleTags = [];
    // Show first N tags
    for (let i = 0; i < this.tagsPerPage && this.hiddenTags.length > 0; i++) {
      const tag = this.hiddenTags.shift();
      tag.visible = true;
      this.visibleTags.push(tag);
    }
  }

  startTripPlanning() {
    this.swipeLeft = true;
    setTimeout(() => {
      this.showBasics = true;
    }, 500);
  }

  goToActivities() {
    this.swipeLeftBasics = true;
    setTimeout(() => {
      this.showActivities = true;
      this.resetActivities();
    }, 500);
  }

  toggleTag(tag: any, fromSelected = false) {
    if (fromSelected) {
      // Remove from selectedTags
      this.selectedTags = this.selectedTags.filter(t => t.key !== tag.key);
      // Add back to hiddenTags
      this.hiddenTags.push(tag);
      // If visibleTags has less than tagsPerPage, show this tag
      if (this.visibleTags.length < this.tagsPerPage) {
        const newTag = this.hiddenTags.shift();
        if (newTag) {
          newTag.visible = true;
          this.visibleTags.push(newTag);
        }
      }
    } else {
      // Fade out the tag
      tag.visible = false;
      setTimeout(() => {
        // Remove from visibleTags
        this.visibleTags = this.visibleTags.filter(t => t.key !== tag.key);
        // Add to selected
        this.selectedTags.push(tag);
        // Add a new tag if available
        if (this.hiddenTags.length > 0) {
          const newTag = this.hiddenTags.shift();
          newTag.visible = true;
          this.visibleTags.push(newTag);
        }
      }, 400); // Match fade out duration
    }
  }
}
