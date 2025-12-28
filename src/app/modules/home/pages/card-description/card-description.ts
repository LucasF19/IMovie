import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Genre } from '../../interfaces/home-interface';
import { ActivatedRoute, Router } from '@angular/router';
import { convertRuntime } from 'src/app/shared/formatters/currect-hour';
import { FavoriteService } from 'src/app/modules/favorites/services/favorites.service';

@Component({
  selector: 'card-description',
  templateUrl: './card-description.html',
  styleUrls: ['./card-description.scss'],
})
export class CardDescription implements OnInit {
  isLoading = true;
  typesMovie: Genre[] = [];
  cast: any[] = [];
  similarMovies: any[] = [];
  reviews: any[] = [];
  movieId!: string;
  movieDetails: any;
  isExpanded: any = {};
  watchProviders: any;
  showModal = false;
  providersList: any;
  favorite!: boolean; 

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router,
    private favoriteService: FavoriteService,
  ) {}

  ngOnInit(): void {
    this.movieId = this.route.snapshot.paramMap.get('id') ?? '';
    this.fetchMovieDetails(this.movieId);
  }

  fetchMovieDetails(id: string): void {
    this.movieService.getMovieDetails(id).subscribe({
      next: (data) => {
        const savedFavorites: any = JSON.parse(localStorage.getItem('favoriteMovies') ?? '[]');

        this.movieDetails = data;
        this.favorite = savedFavorites?.filter((item: { id: string; }) => item.id == this.movieId)?.length > 0;

        this.getSimilarMovies(data.genres[0]?.id);
        this.moviesCredit(id);
        this.getComments(id);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getSimilarMovies(genreId: number): void {
    if (genreId) {
      this.movieService.getMoviesByGenre(genreId).subscribe({
        next: (similar) => {
          this.similarMovies = similar.results;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
        }
      });
    }
  }

  moviesCredit(movieId: string): void {
    this.movieService.getMovieCredits(movieId).subscribe({
      next: (credits) => {
        this.cast = credits.cast;
      },
      error: (error) => {
        console.error('Error fetching movie credits:', error);
      }
    });
  }

  getComments(movieId: string): void{
    this.movieService.getMovieReviews(movieId).subscribe({
      next: (reviews) => {
        this.reviews = reviews.results;
      },
      error: (error) => {
        console.error('Error fetching movie reviews:', error);
      }
    });
  }

  truncateContent(content: string, wordLimit: number): string {
    const words = content.split('');
    
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join('') + '...';
    }
    return content;
  }

  toggleReadMore(id: any) {
    this.isExpanded[id] = !this.isExpanded[id];
  }

  getWatchProviders() {
    this.movieService.getWatchProviders(this.movieId).subscribe(data => {
      this.watchProviders = data.results.BR;
      this.showModal = true;
    });
  }

  toggleFavorite() {
    this.favorite = !this.favorite;

    if (this.favorite) {
      this.favoriteService.addFavorite(this.movieDetails);
    } else {
      this.favoriteService.removeFavorite(this.movieDetails);
    }
  }

  onCloseModal() {
    this.showModal = false;
  }

  goLastPage(){
    window.history.back();
  }

  goHome(){
    this.router.navigate(['/home']);
  }

  getReleaseYear(dateString: string): number {
    return new Date(dateString).getFullYear();
  }

  convertRuntime(runtime: number): string {
    return convertRuntime(runtime);
  }
}
