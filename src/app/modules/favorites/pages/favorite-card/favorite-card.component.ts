import { ViewportScroller } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { convertRuntime } from '../../../../shared/formatters/currect-hour';
import { FavoriteService } from 'src/app/modules/favorites/services/favorites.service';

@Component({
  selector: 'favorite-card',
  templateUrl: './favorite-card.component.html',
  styleUrl: './favorite-card.component.scss'
})
export class FavoriteCardComponent implements OnInit, OnDestroy {
  @Input() movies: any = [];
  @Input() isLoading!: boolean;

  private sub!: Subscription;

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.sub = this.favoriteService.favoriteMovies.subscribe(movies => {
      this.movies = movies;
    });
    this.movies = this.favoriteService.getFavorites();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onClickMovie(movieId: number): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.router.navigate(['home/card-description', movieId]);
  }

  deleteFavorite(movieDetails: any): void {
    this.favoriteService.removeFavorite(movieDetails);
  }

  getPosterPath(movie: any): string {
    return movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : 'https://via.placeholder.com/150';
  }

  convertRuntime(runtime: number): string {
    return convertRuntime(runtime);
  }
}