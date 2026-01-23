Table Anggota{
  idAnggota char(10) [primary key]
  nama varchar(50)
  jenisKelamin char(1)
  tanggalLahir date
  noHp varchar(12)
  prodi varchar(50)
  idKTB char(10)
}

Table KTB{
  idKTB char(10) [primary key]
  angkatan int(4)
  terbentukDimana text
  idPemimpin char(10)
  idPengurus char(10)
}

Table Pengontrolan{
  idPengontrolan char(10) [primary key]
  tanggal date
  bahan varchar(20)
  status enum
  keterangan text
  idKTB varchar(10)
}

Table BadanPengurus{
  idAnggota char(10)
  masaJabatan varchar(20)
  status bool
}

Table User{
  id char(10) [primary key]
  password varchar(255)
  username varchar(50)
  email varchar(50)
  role enum
  idAnggota char(10)
}

Table Hpdt{
  id char(10) [primary key]
  tanggal date
  isSate bool
  isDoa bool
  isAttendedKTB bool
  isGereja bool
  ayatAlkitab varchar(50)
  judulBuku varchar(50)
  idAnggota char(10)
}

Table JenisKegiatan{
  id char(10) [primary key]
  nama varchar(50)
}

Table Kegiatan{
  id char(10) [primary key]
  nama varchar(50)
  tanggal date
  lokasi varchar(50)
  waktu time
  pembicara varchar(50)
  idJenisKegiatan char(10)
}

Table Gallery{
  id char(10) [primary key]
  photos text
  isPublish bool
  idKegiatan char(10)
}

Table Kehadiran{
  id char(10) [primary key]
  nama varchar(10)
  tanggalLahir date
  status enum
  prodi varchar(30)
  idAnggota char(10) [note: "Nullable. Jika user terdaftar, link ke sini. Jika tamu, null."]
  angkatan INT(4)
  tauPmkDariMana text
  idKegiatan char(10)
}

Table Kas{
  id char(10) [primary key]
  nama varchar(50)
  saldo numeric
}

Table Transaksi{
  id char(10)
  jenisTransaksi enum
  nominal numeric
  idKas char(10)
}

// Relasi
// TRANSAKSI
Ref: Transaksi.idKas > Kas.id

// KEHADIRAN
Ref: Kehadiran.idKegiatan > Kegiatan.id

// GALLERY
Ref: Gallery.idKegiatan > Kegiatan.id

// KEGIATAN
Ref: Kegiatan.idJenisKegiatan > JenisKegiatan.id

// BADAN PENGURUS
Ref: BadanPengurus.idAnggota > User.idAnggota
Ref: BadanPengurus.idAnggota < Hpdt.idAnggota

// ANGGOTA
Ref: Anggota.idKTB > KTB.idKTB
Ref: Anggota.idAnggota > BadanPengurus.idAnggota

// KTB
Ref: KTB.idPemimpin > Anggota.idAnggota
Ref: KTB.idPengurus > BadanPengurus.idAnggota

// PENGONTROLAN
Ref: Pengontrolan.idKTB > KTB.idKTB