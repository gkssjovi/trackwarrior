let mapleader = " "

set tabstop=4
set shiftwidth=4
set noexpandtab
set nobackup
set nowritebackup
set whichwrap+=<,>,h,l,[,]
set incsearch
set ignorecase
set smartcase
set smartindent
set wildmenu
set wildmode=full
set foldmethod=indent
set foldenable
set foldlevelstart=10
set foldnestmax=10
set laststatus=2
set splitright
set splitbelow
set backspace=indent,eol,start
set nowrap
set nohlsearch
set timeoutlen=2000
set mouse=
set noswapfile
set hidden

" Better display for messages
set cmdheight=2

" You will have bad experience for diagnostic messages when it's default 4000.
set updatetime=300

" don't give |ins-completion-menu| messages.
set shortmess+=c

" always show signcolumns
set signcolumn=yes

set relativenumber
set number

nnoremap <silent><leader>k :bn<CR>
nnoremap <silent><leader><leader>k :bn!<CR>
nnoremap <silent><leader>j :bp<CR>
nnoremap <silent><leader><leader>j :bp!<CR>
nnoremap <silent><leader>d :bd<CR>
nnoremap <silent><leader><leader>d :bd!<CR>
nnoremap <silent><leader>w :w<CR>
nnoremap <silent><leader>wq :wq<CR>
nnoremap <silent><leader>q :q<CR>
nnoremap <silent><leader>o gf<ESC>
