use magnus::{define_module, Error};
use mimalloc::MiMalloc;

/// mimalloc is a compact general purpose allocator with excellent performance.
/// https://github.com/microsoft/mimalloc
#[global_allocator]
static GLOBAL: MiMalloc = MiMalloc;

mod core_ext;
mod utils;

/// It's will be called when the extension is loaded.
/// @see https://docs.rs/magnus/latest/magnus/attr.init.html
#[magnus::init]
fn init() -> Result<(), Error> {
    let module = define_module("Brickdoc")?;
    utils::init(module)?;
    // core_ext does not need to be inherited from parent
    core_ext::init()?;
    Ok(())
}
