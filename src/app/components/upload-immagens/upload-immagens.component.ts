import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-upload-immagens',
  templateUrl: './upload-immagens.component.html',
  styleUrl: './upload-immagens.component.scss'
})
export class UploadImmagensComponent implements OnChanges {
  @Input() arquivos: File[] = [];
  @Output() onArquivosAlterados = new EventEmitter<File[]>();

  previews: string[] = [];
  erro: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['arquivos'] && this.arquivos.length === 0) {
      this.previews = [];
    }
  }

  adicionarImagem(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.erro = 'Apenas arquivos de imagem são permitidos.';
      return;
    }

    if (this.arquivos.length >= 5) {
      this.erro = 'Você só pode adicionar até 5 imagens.';
      return;
    }

    this.arquivos.push(file);
    this.onArquivosAlterados.emit(this.arquivos);

    const reader = new FileReader();
    reader.onload = () => {
      this.previews.push(reader.result as string);
    };
    reader.readAsDataURL(file);

    this.erro = null;
  }

  removerImagem(index: number) {
    this.arquivos.splice(index, 1);
    this.previews.splice(index, 1);
    this.onArquivosAlterados.emit(this.arquivos);
    this.erro = null;
  }
}
