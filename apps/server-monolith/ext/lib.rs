use magnus::{define_module, Error};

#[cfg(not(target_env = "msvc"))]
use tikv_jemallocator::Jemalloc;

/// Our ruby runtime is also bundled with the jemalloc allocator.
#[cfg(not(target_env = "msvc"))]
#[global_allocator]
static GLOBAL: Jemalloc = Jemalloc;

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
