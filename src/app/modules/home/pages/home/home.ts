import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MovieService } from '../../services/movie.service';
import { AuthService } from '../../../services/auth.service';
import { Genre, Movie } from '../../interfaces/home-interface';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { Router } from '@angular/router';
import { convertRuntime } from 'src/app/shared/formatters/currect-hour';
import { FavoriteService } from 'src/app/modules/favorites/services/favorites.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})

export class AppHome implements OnInit, OnDestroy {
  nomeUsuario: string = '';
  searchControl: FormControl = new FormControl('');
  releasesMovies: any[] = [];
  popularMovies: any[] = [];
  genresMovies: { [key: string]: any[] } = {};
  filteredMovies: any[] = [];
  allMovies!: Array<any>;
  emptyFilter!: boolean;
  isLoading = true;
  searching!: boolean;
  favorite!: boolean; 

  featuredMovie: any;
  currentBanner = 0;
  bannerInterval: any;

  typesMovie: Genre[] = [];

  constructor(private movieService: MovieService, private favoriteService: FavoriteService, private authService: AuthService, private afAuth: AngularFireAuth, private router: Router, private viewportScroller: ViewportScroller) { }

  ngOnInit(): void {
    this.carregarNomeUsuario();
    this.getTypesList();
    this.getAllMovies();
    this.getPopularMovies();

    this.searchControl.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(value => {
      this.filterMovies(value);
    });
  }

  ngOnDestroy() {
    clearInterval(this.bannerInterval);
  }

  filterMovies(query: string) {
    if (query.length === 0) {
      this.searching = false;
      this.filteredMovies = [];
      return;
    }
  
    this.searching = true;
    this.emptyFilter = false;
  
    this.movieService.searchMovies(query).subscribe({
      next: (data) => {
        this.filteredMovies = data.results.filter((movie: any) => movie.backdrop_path);
        this.emptyFilter = this.filteredMovies.length === 0;
      },
      error: () => {
        this.emptyFilter = true;
      }
    });
  }

  movieSelectSearch(movieId: string){
    this.viewportScroller.scrollToPosition([0, 0]);
    this.router.navigate(['home/card-description', movieId]);
  }

  getTypesList() {
    this.movieService.getTypesList().subscribe((data: any) => {
      this.typesMovie = data.genres;
      this.getMoviesByGenres();
    });
  }

  getMoviesByGenres() {
    const allMoviesSet: Set<any> = new Set();
    this.allMovies = [];
  
    this.typesMovie.forEach(genre => {
      this.movieService.getMoviesByGenre(genre.id).subscribe((data: any) => {
        this.genresMovies[genre.name] = data.results;

        data.results.forEach((movie: Movie) => {
          if (!allMoviesSet.has(movie.id)) {
            allMoviesSet.add(movie.id);
            this.allMovies.push(movie);
          }
        });

        this.isLoading = false;
      });
    });
  }

  startBannerCarousel(movieBanner: any) {
    this.bannerInterval = setInterval(() => {  
      this.currentBanner++;
  
      if (this.currentBanner >= this.releasesMovies.length) {
        this.currentBanner = 0;
      }
  
      this.featuredMovie = this.releasesMovies[this.currentBanner];
  
    }, 6000);
  }

  getPopularMovies(){
    this.movieService.getPopularMovies().subscribe((data: any) => {
      this.popularMovies = data.results;
    })
  }

  getAllMovies() {
    this.movieService.getReleasesMovies().subscribe((data: any) => {
      this.releasesMovies = data.results;
  
      if (this.releasesMovies.length > 0) {
        this.movieService.getMovieDetails(this.releasesMovies[0].id).subscribe({
          next: (data) => {
            this.featuredMovie = data;
          },
          error: () => {
            this.isLoading = false;
          }
        });
      }


      this.startBannerCarousel(this.featuredMovie);
      this.isLoading = false;
    });
  }

  onClickMovie(movieId: number): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.router.navigate(['home/card-description', movieId]);
  }

  toggleFavorite() {
    const isFav = this.isFavorite(this.featuredMovie);
  
    if (isFav) {
      this.favoriteService.removeFavorite(this.featuredMovie);
    } else {
      this.favoriteService.addFavorite(this.featuredMovie);
    }
  }
  
  isFavorite(movie: any): boolean {
    if (!movie) return false;
    const favorites = this.favoriteService.getFavorites();
    return favorites.some((f: any) => f.id === movie.id);
  }

  logout() {
    this.authService.logout();
  }

  async carregarNomeUsuario() {
    const user = await this.afAuth.currentUser;
    if (user) {
      const uid = user.uid;
      const nome = await this.authService.getNomeUsuario(uid);
      if (nome) {
        this.nomeUsuario = nome;
      }
    }
  }

  getReleaseYear(dateString: string): number {
    return new Date(dateString).getFullYear();
  }

  convertRuntime(runtime: number): string {
    return convertRuntime(runtime);
  }
}