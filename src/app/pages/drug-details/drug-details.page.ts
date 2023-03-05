import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { DrugsService } from 'src/app/services/drugs.service';
import { Drug } from '../home/home.page';

@Component({
  selector: 'app-drug-details',
  templateUrl: './drug-details.page.html',
  styleUrls: ['./drug-details.page.scss'],
})
export class DrugDetailsPage implements OnInit {
  drugId: number = 0;
  drugs: Drug[] = [];
  drug: Drug = {
    id: 0,
    tradename: '',
    activeingredient: '',
    price: '',
    company: '',
    group: '',
    pamphlet: '',
    dosage: '',
    composition: '',
  };
  loading: boolean = true;
  activeingredients: string[] = [];
  showPharma = false;
  similars: Drug[] = [];
  constructor(
    public route: ActivatedRoute,
    private drugsService: DrugsService,
    private router: Router
  ) {
    this.route.paramMap.subscribe((paramMap) => {
      this.drugId = Number(paramMap.get('id'));
    });
  }

  ngOnInit() {
    if (this.drugs.length) {
      this.drugs = this.drugsService.drugs;
      this.drug = this.drugs.find((drug) => drug.id === this.drugId)!;
      this.prepareUI();
    } else {
      this.drugsService.getDrugs().subscribe((drugs) => {
        this.drugs = drugs;
        this.drug = this.drugs.find((drug) => drug.id === this.drugId)!;
        this.prepareUI();
      });
    }
  }
  prepareUI() {
    this.loading = false;
    console.log(this.drug);
    this.activeingredients = this.drug.activeingredient.split('+');
    this.loadDrugSimilars().then((drugs) => {
      this.similars = drugs;
      console.log('similars', this.similars);
    });
    console.log(this.activeingredients);
  }
  searchActiveIngredient(a: any) {
    this.activeingredients = this.drug.activeingredient.split(',');
  }
  viewDrugGroup() {
    console.log(this.drug.group);
  }
  viewCompanyProducts() {
    console.log(this.drug.company);
  }
  togglePharma() {
    this.showPharma = !this.showPharma;
  }
  openDrug(drug: Drug) {
    this.router.navigateByUrl(`/drugs/${drug.id}`);
  }

  googleMore() {
    window.open(
      `https://www.google.com/search?q=${this.drug.tradename}`,
      '_system'
    );
  }
  viewPicture() {
    console.log(this.drug.pamphlet);
  }
  loadDrugSimilars(): Promise<Drug[]> {
    let similarDrugs: Drug[] = [];
    //function to push similar drugs to class similars array
    const pushSimilars = () => {
      //loop to find which have the save ingredienets;
      for (let i = 0; i < this.drugs.length; i++) {
        if (this.drug.activeingredient === this.drugs[i].activeingredient) {
          //push if similar -> similar has the same active ingredient
          similarDrugs.push(this.drugs[i]);
        }
      }
    };

    const quickRank = (drugs: Drug[]) => {
      const lowestPrice = (a: Drug, b: Drug) =>
        Number(a.price) - Number(b.price);
      return drugs.sort(lowestPrice);
    };

    //method returns promise of similar drugs...
    return new Promise((resolve, reject) => {
      //we have data already loaded
      //usually we have it when we use direct link
      if (this.drugs.length) {
        pushSimilars();
        quickRank(similarDrugs);
      } else {
        //coming from navigation page
        //load the drugs to pick similar
        //current data is limited to data coming from nav object
        this.drugsService.getDrugs().subscribe((result: Drug[]) => {
          this.drugs = result;
          pushSimilars();
          quickRank(similarDrugs);
        });
      }

      resolve(similarDrugs);
    });
  }
}
