import { Component, OnDestroy, OnInit } from '@angular/core';
import { FavoriteService } from '../../services/favorites.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'favorites-page',
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.scss'],
})
export class FavoritesPage implements OnInit, OnDestroy {
  nomeUsuario: string = '';
  favoriteMovies: any[] = [];
  isLoading = true;

  private sub!: Subscription;

  constructor(private favoriteService: FavoriteService) {}

  ngOnInit(): void {
    this.sub = this.favoriteService.favoriteMovies.subscribe(movies => {
      this.favoriteMovies = movies.filter(movie => movie.id);
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
